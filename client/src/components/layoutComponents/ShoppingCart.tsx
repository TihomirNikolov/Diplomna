import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useShoppingCart } from "../../contexts";
import { Separator } from "../ui/separator";
import { Link } from "react-router-dom";

export default function ShoppingCart() {

    const { shoppingCartItems, sum } = useShoppingCart();

    return (
        <Link to='/checkout/cart' className="flex gap-2 cursor-pointer items-center">
            <div className="relative">
                <FontAwesomeIcon id="shoppingCart" icon={["fas", "cart-shopping"]} size="lg" className="text-gray-900 dark:text-white" />
                <span className="absolute -top-2 -right-3 px-2 py-0 rounded-lg
                 bg-orange-500 dark:bg-orange-500 cursor-pointer">
                    {shoppingCartItems.length}
                </span>
            </div>
            <Separator orientation="vertical" className="ml-2 h-5 bg-black dark:bg-white" />
            <span className="text-gray-900 dark:text-white">{sum.toFixed(2)} лв.</span>
        </Link>
    )
}