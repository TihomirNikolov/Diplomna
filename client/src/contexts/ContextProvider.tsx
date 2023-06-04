import { FavouritesProvider, LanguageProvider, ThemeProvider, UserProvider } from ".";
import ShoppingCardProvider from "./shoppingCartContext/ShoppingCartProvider";

export default function ContextProvider(props: any) {

    return (
        <LanguageProvider>
            <UserProvider>
                <ThemeProvider>
                    <ShoppingCardProvider>
                        <FavouritesProvider>
                            {props.children}
                        </FavouritesProvider>
                    </ShoppingCardProvider>
                </ThemeProvider>
            </UserProvider>
        </LanguageProvider>
    )
}