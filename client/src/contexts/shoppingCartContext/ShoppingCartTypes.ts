import { Dictionary } from "../../utilities"

export interface ShoppingCartItem {
    name: Dictionary<string>,
    coverTags: Dictionary<Dictionary<string>>,
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