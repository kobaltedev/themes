import { type Accessor, createContext, useContext } from "solid-js";

export type Theme = "light" | "dark" | "system" | (string & {});

export type ThemeContextValue = {
	theme: Accessor<Theme>;
	resolvedTheme: Accessor<string>;
	setTheme: (theme: Theme) => void;
	themes: string[];
};

export const ThemeContext = createContext<ThemeContextValue>();

export function useTheme(): ThemeContextValue {
	const context = useContext(ThemeContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte/themes]: `useTheme` must be used within a `ThemeProvider`",
		);
	}

	return context;
}
