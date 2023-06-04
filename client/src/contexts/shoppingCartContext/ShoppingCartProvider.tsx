import { useState } from "react";
import { ShoppingCartItem } from ".";
import { ShoppingCartContext } from "./ShoppingCartContext";
import { notification } from "../../utilities";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../languageContext";

export default function ShoppingCardProvider(props: any) {
    const { t } = useTranslation();
    const { language } = useLanguage();

    const [shoppingCartItems, setShoppingCartItems] = useState<ShoppingCartItem[]>([])

    function addItem(shoppingCartItem: ShoppingCartItem) {
        var items = [...shoppingCartItems];

        var item = items.filter(item => item.name[language.code] == shoppingCartItem.name[language.code])[0];
        if (item != null) {
            item.number += shoppingCartItem.number;
        }
        else {
            items.push({
                name: shoppingCartItem.name, coverTags: shoppingCartItem.coverTags, price: shoppingCartItem.price,
                number: shoppingCartItem.number, imageUrl: shoppingCartItem.imageUrl, productUrl: shoppingCartItem.productUrl
            });
        }

        setShoppingCartItems(items);
        notification.success(t('successfullyAdded') + shoppingCartItem.name[language.code] + t('toYourShoppingCart'));
    }

    function removeItem(shoppingCartItem: ShoppingCartItem) {
        var newItems = shoppingCartItems.filter(i => i.name != shoppingCartItem.name);

        setShoppingCartItems(newItems);
    }

    function changeCount(shoppingCartItem: ShoppingCartItem, newCount: number) {
        var items = [...shoppingCartItems];

        var item = items.filter(item => item.name == shoppingCartItem.name)[0];

        if (item != null) {
            item.number = newCount;
        }

        setShoppingCartItems(items);
    }

    return (
        <ShoppingCartContext.Provider value={{
            shoppingCartItems: shoppingCartItems,
            addShoppingCartItem: addItem, removeShoppingCartItem: removeItem, changeShoppingCartItemCount: changeCount
        }}>
            {props.children}
        </ShoppingCartContext.Provider>
    )
}