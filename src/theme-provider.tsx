import {
	type ParentProps,
	createEffect,
	createSignal,
	onCleanup,
	onMount,
} from "solid-js";
import { getRequestEvent, isServer } from "solid-js/web";
import { type Theme, ThemeContext } from "./theme-context";

const DEFAULT_COOKIE_NAME = "theme";
const COOKIE_MAX_AGE = 31536000; // 1 year in seconds

export type ThemeProviderProps = ParentProps<{
	defaultTheme?: Theme;
	themes?: string[];
	attribute?: "class" | "data-theme";
	disableTransitionOnChange?: boolean;
	cookieName?: string;
}>;

function getCookie(name: string, cookieString: string | null): string | null {
	if (!name || !cookieString) return null;
	const match = cookieString.match(new RegExp(`\\W?${name}=([^;]+)`));
	return match ? match[1] : null;
}

function getThemeCookie(cookieName: string): string | null {
	if (isServer) {
		const event = getRequestEvent();
		if (!event) return null;
		return getCookie(cookieName, event.request.headers.get("cookie"));
	}
	return getCookie(cookieName, document.cookie);
}

function setThemeCookie(cookieName: string, value: string): void {
	if (isServer) return;
	document.cookie = `${cookieName}=${value}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
}

export function ThemeProvider(props: ThemeProviderProps) {
	const themes = () => props.themes ?? ["light", "dark", "system"];
	const attribute = () => props.attribute ?? "data-theme";
	const cookieName = () => props.cookieName ?? DEFAULT_COOKIE_NAME;
	const defaultTheme = () => props.defaultTheme ?? "system";

	const getInitialTheme = (): Theme => {
		const stored = getThemeCookie(cookieName());
		if (stored && themes().includes(stored)) return stored;
		return defaultTheme();
	};

	const [theme, setThemeInternal] = createSignal<Theme>(getInitialTheme());
	const [systemTheme, setSystemTheme] = createSignal<"light" | "dark">(
		isServer
			? "light"
			: window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light",
	);

	const resolvedTheme = () => (theme() === "system" ? systemTheme() : theme());

	const setTheme = (newTheme: Theme) => {
		setThemeInternal(newTheme);
		setThemeCookie(cookieName(), newTheme);
	};

	createEffect(() => {
		if (isServer) return;

		const resolved = resolvedTheme();
		const root = document.documentElement;
		const attr = attribute();

		if (props.disableTransitionOnChange) {
			root.style.setProperty("transition", "none");
		}

		if (attr === "class") {
			for (const t of themes()) {
				if (t !== "system") root.classList.remove(t);
			}
			root.classList.add(resolved);
		} else {
			root.setAttribute("data-theme", resolved);
		}

		root.classList.toggle("dark", resolved === "dark");

		if (props.disableTransitionOnChange) {
			void root.offsetHeight; // Force reflow
			root.style.removeProperty("transition");
		}
	});

	onMount(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handleChange = (e: MediaQueryListEvent) => {
			setSystemTheme(e.matches ? "dark" : "light");
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
