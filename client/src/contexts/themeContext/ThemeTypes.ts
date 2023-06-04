import { SetStateAction } from "react";

export type Theme = 'dark' | 'light'

export type ThemeContextType = {
    theme: Theme,
    setTheme: (Theme: SetStateAction<Theme>) => void;
}