import { createContext, useContext } from "react";
import { ShoppingCartContextType, ShoppingCartItem } from "./ShoppingCartTypes";

export const ShoppingCartContext = createContext<ShoppingCartContextType>({
    shoppingCartItems: [],
    addShoppingCartItem: (item: ShoppingCartItem) => console.log(item),
    removeShoppingCartItem: (item: ShoppingCartItem) => console.log(item),
    changeShoppingCartItemCount: (item: ShoppingCartItem, newCount: number) => console.log(item)
})

export const useShoppingCart = () => useContext(ShoppingCartContext)