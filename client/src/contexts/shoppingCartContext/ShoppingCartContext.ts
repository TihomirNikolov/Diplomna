import { createContext, useContext } from "react";
import { ShoppingCartContextType, ShoppingCartItem } from "./ShoppingCartTypes";

export const ShoppingCartContext = createContext<ShoppingCartContextType>({
    shoppingCartItems: [],
    addShoppingCartItem: (item: ShoppingCartItem) => Promise.resolve(console.log(item)),
    removeShoppingCartItem: (item: ShoppingCartItem) => Promise.resolve(console.log(item)),
    changeShoppingCartItemCount: (item: ShoppingCartItem, newCount: number) => Promise.resolve(console.log(item)),
    merge: () => Promise.resolve(console.log('merging'))
})

export const useShoppingCart = () => useContext(ShoppingCartContext)