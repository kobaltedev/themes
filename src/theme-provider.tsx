import {
	type ParentProps,
	createEffect,
	createSignal,
	on,
	onCleanup,
	onMount,
} from "solid-js";
import { getRequestEvent, isServer } from "solid-js/web";
import { type Theme, ThemeContext } from "./theme-context";

const DEFAULT_COOKIE_NAME = "theme";
const COOKIE_MAX_AGE = 31536000; // 1 year in seconds

export type ThemeProviderProps = ParentProps<{
	/** Default theme to use if none is stored. Defaults to "system". */
	defaultTheme?: Theme;
	/** List of available theme names. Defaults to ["light", "dark", "system"]. */
	themes?: string[];
	/** Attribute to set on the HTML element. Defaults to "data-theme". */
	attribute?: "class" | "data-theme";
	/** Whether to disable transitions when switching themes. Defaults to false. */
	disableTransitionOnChange?: boolean;
	/** Cookie name for persisting theme. Defaults to "theme". */
	cookieName?: string;
}>;

/**
 * Parse a cookie value from a cookie string.
 */
function getCookie(name: string, cookieString: string | null): string | null {
	if (!name || !cookieString) return null;
	const match = cookieString.match(new RegExp(`\\W?${name}=([^;]+)`));
	return match ? match[1] : null;
}

/**
 * Get the theme from cookies, works on both server and client.
 */
function getThemeCookie(cookieName: string): string | null {
	if (isServer) {
		const event = getRequestEvent();
		if (!event) return null;
		return getCookie(cookieName, event.request.headers.get("cookie"));
	}
	return getCookie(cookieName, document.cookie);
}

/**
 * Set a cookie on the client.
 */
function setThemeCookie(cookieName: string, value: string): void {
	if (isServer) return;
	document.cookie = `${cookieName}=${value}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
}

/**
 * Get the resolved theme that ThemeScript already applied to the DOM.
 */
function getAppliedTheme(attribute: "class" | "data-theme"): string | null {
	if (isServer) return null;
	const root = document.documentElement;
	if (attribute === "data-theme") {
		return root.getAttribute("data-theme");
	}
	// For class attribute, we'd need to know the possible themes to check
	return null;
}

export function ThemeProvider(props: ThemeProviderProps) {
	const themes = () => props.themes ?? ["light", "dark", "system"];
	const attribute = () => props.attribute ?? "data-theme";
	const cookieName = () => props.cookieName ?? DEFAULT_COOKIE_NAME;
	const defaultTheme = () => props.defaultTheme ?? "system";

	const getSystemTheme = (): "light" | "dark" => {
		if (isServer) return "light";
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	};

	const getInitialTheme = (): Theme => {
		const stored = getThemeCookie(cookieName());
		if (stored && themes().includes(stored)) return stored;
		return defaultTheme();
	};

	const resolveTheme = (t: Theme): string => {
		if (t === "system") {
			return getSystemTheme();
		}
		return t;
	};

	// Get the initial resolved theme - on client, prefer what ThemeScript already set
	const getInitialResolvedTheme = (): string => {
		if (!isServer) {
			// On client, ThemeScript has already set the correct theme
			// Read it from the DOM to avoid any mismatch
			const applied = getAppliedTheme(attribute());
			if (applied) return applied;
		}
		// Fallback to computing it
		return resolveTheme(getInitialTheme());
	};

	const [theme, setThemeSignal] = createSignal<Theme>(getInitialTheme());
	const [resolvedTheme, setResolvedTheme] = createSignal<string>(
		getInitialResolvedTheme(),
	);

	const setTheme = (newTheme: Theme) => {
		setThemeSignal(newTheme);
		setThemeCookie(cookieName(), newTheme);
	};

	const applyTheme = (themeValue: string) => {
		if (isServer) return;

		const root = document.documentElement;
		const attr = attribute();

		if (props.disableTransitionOnChange) {
			root.style.setProperty("transition", "none");
		}

		if (attr === "class") {
			// Remove all theme classes and add the new one
			for (const t of themes()) {
				if (t !== "system") root.classList.remove(t);
			}
			root.classList.add(themeValue);
		} else {
			root.setAttribute("data-theme", themeValue);
		}

		// Also set class="dark" for Tailwind compatibility (only for dark theme)
		root.classList.toggle("dark", themeValue === "dark");

		if (props.disableTransitionOnChange) {
			// Force reflow
			void root.offsetHeight;
			root.style.removeProperty("transition");
		}
	};

	// Only apply theme when theme signal changes (not on initial render)
	// ThemeScript has already set the correct theme before hydration
	createEffect(
		on(
			theme,
			(currentTheme) => {
				const resolved = resolveTheme(currentTheme);
				setResolvedTheme(resolved);
				applyTheme(resolved);
			},
			{ defer: true },
		),
	);

	// Listen for system theme changes
	onMount(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handleChange = (e: MediaQueryListEvent) => {
			if (theme() === "system") {
				const resolved = e.matches ? "dark" : "light";
				setResolvedTheme(resolved);
				applyTheme(resolved);
			}
		};

		mediaQuery.addEventListener("change", handleChange);
		onCleanup(() => mediaQuery.removeEventListener("change", handleChange));
	});

	return (
		<ThemeContext.Provider
			value={{
				theme,
				resolvedTheme,
				setTheme,
				themes: themes(),
			}}
		>
			{props.children}
		</ThemeContext.Provider>
	);
}
