import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useShoppingCart } from "../../contexts";
import { useEffect, useState } from "react";

export default function ShoppingCart() {
    const navigate = useNavigate();

    const { shoppingCartItems, sum } = useShoppingCart();

    return (
        <div className="flex gap-2 cursor-pointer" onClick={() => navigate('/checkout/cart')}>
            <div className="relative">
                <FontAwesomeIcon id="shoppingCart" icon={["fas", "cart-shopping"]} size="lg" className="text-gray-900 dark:text-white" />
                <label htmlFor="shoppingCart"
                    className="absolute -top-2 -right-3 px-2 py-0 rounded-lg
                 bg-orange-500 dark:bg-orange-500 cursor-pointer">
                    {shoppingCartItems.length}
                </label>
            </div>
            <span className="border-l-2 border-l-white" />
            <span className="text-gray-900 dark:text-white">{sum}</span>
        </div>
    )
}