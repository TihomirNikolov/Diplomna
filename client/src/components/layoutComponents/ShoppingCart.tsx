import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

export default function ShoppingCart() {
    const navigate = useNavigate();

    return (
        <div className="flex gap-2 cursor-pointer" onClick={() => navigate('/checkout/cart')}>
            <FontAwesomeIcon icon={["fas", "cart-shopping"]} size="lg" className="text-gray-900 dark:text-white" />
            <span className="border-l-2 border-l-white" />
            <span className="text-gray-900 dark:text-white">0.00</span>
        </div>
    )
}