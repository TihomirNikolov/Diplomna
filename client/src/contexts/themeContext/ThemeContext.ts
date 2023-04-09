import { createContext, useContext } from "react";
import { ThemeContextType } from ".";

export const ThemeContext = createContext<ThemeContextType>({theme: 'dark', setTheme: theme => console.log('no theme provider')});

export const useTheme = () => useContext(ThemeContext);