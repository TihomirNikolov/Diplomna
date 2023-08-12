import { useTranslation } from "react-i18next";
import { useTitle } from "../../components";
import { ShoppingCartItem, useLanguage, useShoppingCart } from "../../contexts";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { axiosClient, baseProductsURL, notification } from "@/utilities";
import axios from "axios";
import { AreProductsAvailableRequest } from "@/utilities/requests";
import { StoreProduct } from "@/utilities/models/store/Product";
import { AreProductsAvailableResponse } from "@/utilities/responses";
import { Image } from "@/components/utilities";

export default function ShoppingCartPage() {
    const { t } = useTranslation();
    useTitle(t('title.shoppingCart'));

    const { shoppingCartItems, changeShoppingCartItemCount, removeShoppingCartItem, sum } = useShoppingCart();
    const { language } = useLanguage();

    const navigate = useNavigate();

    function changeItemCount(e: React.FocusEvent<HTMLInputElement, Element>, item: ShoppingCartItem) {
        var newCount = parseInt(e.target.value) || 0;
        newCount = Math.abs(newCount);
        if (newCount <= 999) {
            changeShoppingCartItemCount(item, newCount);
        }
    }

    function incrementShoppingCartItemCount(item: ShoppingCartItem) {
        if (item.number < 999) {
            changeShoppingCartItemCount(item, item.number + 1);
        }
    }

    function decrementShoppingCartItemCount(item: ShoppingCartItem) {
        if (item.number > 1) {
            changeShoppingCartItemCount(item, item.number - 1);
        }
    }

    function removeItem(item: ShoppingCartItem) {
        removeShoppingCartItem(item);
    }

    async function onNavigate(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        e.preventDefault();
        try {
            var storeProducts: StoreProduct[] = [];
            for (var item of shoppingCartItems) {
                storeProducts.push({ storeId: item.storeId, productId: item.productId, count: item.number });
            }
            var request: AreProductsAvailableRequest = {
                storeProducts: storeProducts
            }
            var response = await axiosClient.post(`${baseProductsURL()}api/stores/available`, request);
            var data = response.data as AreProductsAvailableResponse
            if (data.isSuccessful) {
                navigate('/checkout/finish');
            }
            else {
                notification.error('error', 'top-center');
            }
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
        }
    }

    if (shoppingCartItems.length < 1) {
        return (
            <div className="mt-5">
                <div className="flex flex-col gap-5 items-center">
                    <h1 className="font-bold text-3xl text-black dark:text-white">{t('emptyCart')}</h1>
                    <Link to='/' className="text-white bg-orange-500 py-2 px-5 hover:bg-orange-600">
                        {t('goToHome')}
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-12">
            <div className="col-start-3 col-span-8">
                <h1 className="py-5 text-3xl text-black dark:text-white">{t('yourCart')}</h1>
                <div className="grid grid-cols-5 text-black dark:text-white place-items-center">
                    <div className="col-span-2">
                        {t('product')}
                    </div>
                    <div className="">
                        {t('price')}
                    </div>
                    <div>
                        {t('count')}
                    </div>
                    <div>
                        {t('sum')}
                    </div>
                </div>
                <section className="py-2">
                    {shoppingCartItems.map((item, index) => {
                        return (
                            <div key={index} className="grid grid-cols-5 items-center
                             text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg">
                                <div className="col-span-2">
                                    <div className="flex">
                                        <div>
                                            <Image src={`${baseProductsURL()}${item.imageUrl}`} className="rounded-lg w-24" alt="shoppingCart" />
                                        </div>
                                        <div className="px-2">
                                            <Link to={`/product/${item.productUrl}`} className="hover:text-orange-500">
                                                <div>
                                                    {item.name.find(i => i.key == language.code)?.value}
                                                </div>
                                            </Link>
                                            {item.coverTags.find(i => i.key == language.code)?.value.map((item, index) => {
                                                return (
                                                    <div key={index} className="mt-2 h-6 flex overflow-hidden text-sm text-gray-400">
                                                        <span>{item.key} : {item.value}</span>
                                                    </div>)
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center">
                                    {item.discount > 0 ?
                                        <div className="flex space-x-1">
                                            <span className="line-through decoration-red-600 decoration-2">
                                                {item.price.toFixed(2)} лв.
                                            </span>
                                            <span>
                                                {item.discountedPrice.toFixed(2)} лв.
                                            </span>
                                        </div> :
                                        <>
                                            <span>{item.price.toFixed(2)} лв.</span>
                                        </>
                                    }
                                </div>
                                <div className="flex items-center justify-center gap-1">
                                    <button className="px-3 py-1 bg-gray-300 dark:bg-gray-900"
                                        onClick={() => decrementShoppingCartItemCount(item)}>
                                        -
                                    </button>
                                    <input defaultValue={item.number} key={item.number}
                                        className="px-2 py-1 border border-gray-300 dark:border-gray-700 bg-transparent w-12
                                        text-center focus:outline-none focus:outline-offset-0
                                         focus:outline-blue-600 focus:dark:outline-blue-600"
                                        onBlur={(e) => changeItemCount(e, item)} />
                                    <button className="px-3 py-1 bg-gray-300 dark:bg-gray-900"
                                        onClick={() => incrementShoppingCartItemCount(item)}>
                                        +
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 items-center justify-items-end">
                                    <span>{(item.number * item.discountedPrice).toFixed(2)} лв.</span>
                                    <FontAwesomeIcon icon={['fas', 'x']} className="mr-2 cursor-pointer hover:text-red-600"
                                        onClick={() => removeItem(item)} />
                                </div>
                            </div>
                        )
                    })}
                </section>
                <div className="flex flex-col">
                    <div className="text-black dark:text-white">
                        {t('total')}: {sum.toFixed(2)} лв.
                    </div>
                    <Link to="/checkout/finish" className="mt-2 px-5 py-2 w-48 text-white
                     bg-orange-600 rounded-lg hover:bg-orange-700 text-center" onClick={(e) => onNavigate(e)}>
                        {t('checkOut')}
                    </Link>
                </div>
            </div>
        </div>
    )
}