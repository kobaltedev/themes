import { createContext, useContext } from "solid-js";

export const ThemeContext = createContext();

export function useThemeContext() {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error("[kobalte/theme: `useThemeContext` must be used within a `ThemeProvider")
    }
    return context;
}