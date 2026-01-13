import {
	createSignal,
	createEffect,
	onCleanup,
	onMount,
	type ParentProps,
} from "solid-js";
import { isServer } from "solid-js/web";
import { ThemeContext, type Theme } from "./theme-context";

const STORAGE_KEY = "kobalte-theme";

export type ThemeProviderProps = ParentProps<{
	/** Default theme to use if none is stored. Defaults to "system". */
	defaultTheme?: Theme;
	/** List of available theme names. Defaults to ["light", "dark", "system"]. */
	themes?: string[];
	/** Attribute to set on the HTML element. Defaults to "data-theme". */
	attribute?: "class" | "data-theme";
	/** Whether to disable transitions when switching themes. Defaults to false. */
	disableTransitionOnChange?: boolean;
	/** Storage key for persisting theme. Defaults to "kobalte-theme". */
	storageKey?: string;
}>;

export function ThemeProvider(props: ThemeProviderProps) {
	const themes = () => props.themes ?? ["light", "dark", "system"];
	const attribute = () => props.attribute ?? "data-theme";
	const storageKey = () => props.storageKey ?? STORAGE_KEY;
	const defaultTheme = () => props.defaultTheme ?? "system";

	const getSystemTheme = (): "light" | "dark" => {
		if (isServer) return "light";
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	};

	const getStoredTheme = (): Theme | null => {
		if (isServer) return null;
		try {
			return localStorage.getItem(storageKey()) as Theme | null;
		} catch {
			return null;
		}
	};

	const getInitialTheme = (): Theme => {
		const stored = getStoredTheme();
		if (stored && themes().includes(stored)) return stored;
		return defaultTheme();
	};

	const [theme, setThemeSignal] = createSignal<Theme>(getInitialTheme());
	const [resolvedTheme, setResolvedTheme] = createSignal<"light" | "dark">(
		theme() === "system" ? getSystemTheme() : (theme() as "light" | "dark"),
	);

	const setTheme = (newTheme: Theme) => {
		setThemeSignal(newTheme);
		if (!isServer) {
			try {
				localStorage.setItem(storageKey(), newTheme);
			} catch {
				// localStorage might not be available
			}
		}
	};

	const applyTheme = (resolved: "light" | "dark") => {
		if (isServer) return;

		const root = document.documentElement;
		const attr = attribute();

		if (props.disableTransitionOnChange) {
			root.style.setProperty("transition", "none");
		}

		if (attr === "class") {
			root.classList.remove("light", "dark");
			root.classList.add(resolved);
		} else {
			root.setAttribute("data-theme", resolved);
		}

		// Also set class="dark" for Tailwind compatibility
		root.classList.toggle("dark", resolved === "dark");

		if (props.disableTransitionOnChange) {
			// Force reflow
			void root.offsetHeight;
			root.style.removeProperty("transition");
		}
	};

	// Watch for theme changes and update resolved theme
	createEffect(() => {
		const currentTheme = theme();
		if (currentTheme === "system") {
			setResolvedTheme(getSystemTheme());
		} else {
			setResolvedTheme(currentTheme as "light" | "dark");
		}
	});

	// Apply resolved theme to DOM
	createEffect(() => {
		applyTheme(resolvedTheme());
	});

	// Listen for system theme changes
	onMount(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handleChange = (e: MediaQueryListEvent) => {
			if (theme() === "system") {
				setResolvedTheme(e.matches ? "dark" : "light");
			}
		};

		mediaQuery.addEventListener("change", handleChange);
		onCleanup(() => mediaQuery.removeEventListener("change", handleChange));

		// Listen for storage changes (for multi-tab sync)
		const handleStorage = (e: StorageEvent) => {
			if (e.key === storageKey() && e.newValue) {
				setThemeSignal(e.newValue as Theme);
			}
		};

		window.addEventListener("storage", handleStorage);
		onCleanup(() => window.removeEventListener("storage", handleStorage));
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
