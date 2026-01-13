import { ParentProps } from "solid-js";
import { ThemeContext } from "./theme-context";

export function useTheme() {
    return (
        <ThemeContext.Provider value={{
            theme: "light",
            setTheme: (theme: "light") => console.log(`Theme set to ${theme}`)
        }}>
            {props.children}
        </ThemeContext.Provider>
    );
}