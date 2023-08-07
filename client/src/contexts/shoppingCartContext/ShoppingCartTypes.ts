import { Dictionary, Item } from "../../utilities"

export interface ShoppingCartItem {
    name: Item<string, string>[],
    coverTags: Item<string, Item<string, string>[]>[],
    price: number,
    number: number,
    imageUrl: string,
    productId: string,
    productUrl: string
}

export type ShoppingCartContextType = {
    shoppingCartItems: ShoppingCartItem[],
    addShoppingCartItem: (shoppingCartItem: ShoppingCartItem) => Promise<void>,
    removeShoppingCartItem: (shoppingCartItem: ShoppingCartItem) => Promise<void>,
    changeShoppingCartItemCount: (shoppingCartItem: ShoppingCartItem, newCount: number) => Promise<void>,
    merge: () => Promise<void>,
    sum: number,
    deleteShoppingCart: () => Promise<void>
}