import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useShoppingCart } from "../../contexts";
import { Separator } from "../ui/separator";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ShoppingCart() {
  const { t } = useTranslation();

  const { shoppingCartItems, sum } = useShoppingCart();

  return (
    <Link
      to="/checkout/cart"
      className="flex cursor-pointer items-center gap-2"
    >
      <div className="relative">
        <FontAwesomeIcon
          id="shoppingCart"
          icon={["fas", "cart-shopping"]}
          size="lg"
          className="text-gray-900 dark:text-white"
        />
        <span
          className="absolute -right-3 -top-2 cursor-pointer rounded-lg bg-orange-500
                 px-2 py-0 dark:bg-orange-500"
        >
          {shoppingCartItems.length}
        </span>
      </div>
      <Separator
        orientation="vertical"
        className="ml-2 h-5 bg-black dark:bg-white"
      />
      <span className="text-gray-900 dark:text-white">
        {sum.toFixed(2)} {t("lv")}
      </span>
    </Link>
  );
}
