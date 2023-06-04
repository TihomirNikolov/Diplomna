import { SetStateAction } from "react"

export interface FavouritesItem {
    productUrl: string
}

export type FavouritesContextType = {
    favouritesItems: string[],
    addFavourite: (favouritesItem: string) => void,
    removeFavourite: (favouritesItem: string) => void,
    setFavourites: (favouritesItems: SetStateAction<string[]>) => void
}