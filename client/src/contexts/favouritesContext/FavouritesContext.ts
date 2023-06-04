import { SetStateAction, createContext, useContext } from "react";
import { FavouritesContextType, FavouritesItem } from "./FavouritesTypes";

export const FavouritesContext = createContext<FavouritesContextType>({
    favouritesItems: [],
    addFavourite: (productUrl: string) => console.log(productUrl),
    removeFavourite: (productUrl: string) => console.log(productUrl),
    setFavourites: (productUrls: SetStateAction<string[]>) => console.log(productUrls)
})

export const useFavourites = () => useContext(FavouritesContext)