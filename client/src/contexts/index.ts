import { Theme, ThemeContext, ThemeContextType, ThemeProvider, useTheme } from "./themeContext";
import { User, Role, UserContext, UserContextType, UserProvider, useUser } from "./userContext";
import { ShoppingCartItem, ShoppingCartContext, ShoppingCartContextType, useShoppingCart, ShoppingCartProvider } from "./shoppingCartContext";
import { FavouritesContext, FavouritesContextType, FavouritesItem, FavouritesProvider, useFavourites } from "./favouritesContext";
import { LanguageContext, Language, LanguageContextType, LanguageProvider, Languages, useLanguage } from "./languageContext";
import ContextProvider from "./ContextProvider";

export {
    ThemeContext, ThemeProvider, useTheme,
    UserContext, UserProvider, useUser, ContextProvider,
    ShoppingCartContext, ShoppingCartProvider, useShoppingCart,
    FavouritesContext, FavouritesProvider, useFavourites,
    LanguageContext, LanguageProvider, Languages, useLanguage
};
export type {
    Theme, ThemeContextType, User, Role, UserContextType,
    ShoppingCartContextType, ShoppingCartItem,
    FavouritesContextType, FavouritesItem, Language, LanguageContextType
};

