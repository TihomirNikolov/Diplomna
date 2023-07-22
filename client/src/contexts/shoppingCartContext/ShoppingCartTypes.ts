import { Dictionary, Item } from "../../utilities"

export interface ShoppingCartItem {
    name: Item<string, string>[],
    coverTags: Item<string, Item<string, string>[]>[],
    price: number,
    number: number,
    imageUrl: string,
    productUrl: string
}

export type ShoppingCartContextType = {
    shoppingCartItems: ShoppingCartItem[],
    addShoppingCartItem: (shoppingCartItem: ShoppingCartItem) => void,
    removeShoppingCartItem: (shoppingCartItem: ShoppingCartItem) => void,
    changeShoppingCartItemCount: (shoppingCartItem: ShoppingCartItem, newCount: number) => void
}