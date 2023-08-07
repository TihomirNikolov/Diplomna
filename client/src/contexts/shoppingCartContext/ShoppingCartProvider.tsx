import { useEffect, useState } from "react";
import { ShoppingCartItem } from ".";
import { ShoppingCartContext } from "./ShoppingCartContext";
import { authClient, axiosClient, baseShoppingCartURL, notification } from "../../utilities";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../languageContext";
import axios from "axios";
import { useUser } from "../userContext";

export default function ShoppingCardProvider(props: any) {
    const { t } = useTranslation();
    const { language } = useLanguage();

    const [sum, setSum] = useState<number>(0);
    const [shoppingCartItems, setShoppingCartItems] = useState<ShoppingCartItem[]>([])
    const [isMerging, setIsMerging] = useState<boolean>(false);

    const { isAuthenticated, isUserLoaded } = useUser();

    async function fetchShoppingCartItemsByEmail() {
        try {
            var result = await authClient.get(`${baseShoppingCartURL()}api/shoppingcart/get/email`);
            var data = result.data as ShoppingCartItem[];
            setShoppingCartItems(data);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
        }
    }

    async function fetchShoppingCartItemsByBrowserId() {
        try {
            var result = await axiosClient.get(`${baseShoppingCartURL()}api/shoppingcart/get/browserId/${localStorage.getItem('uuid')}`);
            var data = result.data as ShoppingCartItem[];
            setShoppingCartItems(data);
            var sum = 0;
            data.forEach(item => {
                sum += item.price;
            });
            setSum(sum);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
            console.log(error)
        }
    }

    useEffect(() => {
        if (isUserLoaded && !isMerging) {
            if (isAuthenticated) {
                fetchShoppingCartItemsByEmail();
            }
            else {
                fetchShoppingCartItemsByBrowserId();
            }
        }
    }, [isAuthenticated, isUserLoaded])

    async function addItem(shoppingCartItem: ShoppingCartItem) {
        try {
            var updatedItems: ShoppingCartItem[] = [];
            if (isAuthenticated) {
                var result = await authClient.post(`${baseShoppingCartURL()}api/shoppingcart/add/email`,
                    { productId: shoppingCartItem.productId, number: shoppingCartItem.number });

                updatedItems = result.data as ShoppingCartItem[];
            }
            else {
                var result = await axiosClient.post(`${baseShoppingCartURL()}api/shoppingcart/add/browserid`,
                    { browserId: localStorage.getItem('uuid'), productId: shoppingCartItem.productId, number: shoppingCartItem.number });

                updatedItems = result.data as ShoppingCartItem[];
            }

            setShoppingCartItems(updatedItems);
            var sum = 0;
            updatedItems.forEach(item => {
                sum += item.price;
            });
            setSum(sum);
            notification.success(t('successfullyAdded') + shoppingCartItem.name.find(i => i.key == language.code)?.value + t('toYourShoppingCart'));
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
        }
    }

    async function removeItem(shoppingCartItem: ShoppingCartItem) {
        try {
            var updatedItems: ShoppingCartItem[] = [];

            if (isAuthenticated) {
                var result = await authClient.post(`${baseShoppingCartURL()}api/shoppingcart/remove/email`,
                    { productId: shoppingCartItem.productId });

                updatedItems = result.data as ShoppingCartItem[];
            }
            else {
                var result = await axiosClient.post(`${baseShoppingCartURL()}api/shoppingcart/remove/browserid`,
                    { browserId: localStorage.getItem('uuid'), productId: shoppingCartItem.productId });

                updatedItems = result.data as ShoppingCartItem[];
            }
            setShoppingCartItems(updatedItems);
            var sum = 0;
            updatedItems.forEach(item => {
                sum += item.price;
            });
            setSum(sum);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
        }
    }

    async function changeCount(shoppingCartItem: ShoppingCartItem, newCount: number) {
        try {
            var updatedItems: ShoppingCartItem[] = [];

            if (isAuthenticated) {
                var result = await authClient.put(`${baseShoppingCartURL()}api/shoppingcart/update/email`,
                    { productId: shoppingCartItem.productId, number: newCount });

                updatedItems = result.data as ShoppingCartItem[];
            }
            else {
                var result = await axiosClient.put(`${baseShoppingCartURL()}api/shoppingcart/update/browserid`,
                    { browserId: localStorage.getItem('uuid'), productId: shoppingCartItem.productId, number: newCount });

                updatedItems = result.data as ShoppingCartItem[];
            }

            setShoppingCartItems(updatedItems);
            var sum = 0;
            updatedItems.forEach(item => {
                sum += item.price;
            });
            setSum(sum);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
        }
    }

    async function merge() {
        try {
            setIsMerging(true);
            var result = await authClient.post(`${baseShoppingCartURL()}api/shoppingcart/merge`, { browserId: localStorage.getItem('uuid') });
            var items = result.data as ShoppingCartItem[];
            setShoppingCartItems(items);
            setIsMerging(false);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
            setIsMerging(false);
        }
    }

    async function deleteShoppingCart() {
        if (isAuthenticated) {
            var response = await authClient.delete(`${baseShoppingCartURL()}api/shoppingcart/delete/email`);

            var data = response.data as ShoppingCartItem[];
            setShoppingCartItems(data);
        }
        else {
            var response = await authClient.delete(`${baseShoppingCartURL()}api/shoppingcart/delete/browserId/${localStorage.getItem('uuid')}`);

            var data = response.data as ShoppingCartItem[];
            setShoppingCartItems(data);
        }
    }

    return (
        <ShoppingCartContext.Provider value={{
            shoppingCartItems: shoppingCartItems,
            addShoppingCartItem: addItem, removeShoppingCartItem: removeItem, changeShoppingCartItemCount: changeCount,
            merge: merge, sum: sum, deleteShoppingCart: deleteShoppingCart
        }}>
            {props.children}
        </ShoppingCartContext.Provider>
    )
}