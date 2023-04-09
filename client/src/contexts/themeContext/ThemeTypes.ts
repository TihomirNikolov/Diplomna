export type Theme = 'dark' | 'light'

export type ThemeContextType = {
    theme: Theme,
    setTheme: (Theme: Theme) => void;
}