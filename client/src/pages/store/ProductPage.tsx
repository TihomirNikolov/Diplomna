import { useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Dictionary, Product, ProductReview, axiosClient, baseProductsURL } from "../../utilities";
import axios from "axios";
import { Input, Modal, NotFoundComponent, Reviews, Spinner, Textarea, useTitle } from "../../components";
import { ShoppingCartItem, useFavourites, useLanguage, useShoppingCart, useUser } from "../../contexts";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputHandle } from "../../components/inputs/Input";

export default function ProductPage() {
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const [product, setProduct] = useState<Product>();
    const [isFavourited, setIsFavourited] = useState<boolean>(false);

    const { addShoppingCartItem } = useShoppingCart();
    const { favouritesItems, addFavourite, removeFavourite } = useFavourites();
    const { language } = useLanguage();

    const { productUrl } = useParams();

    useEffect(() => {
        fethData();
    }, [])

    useEffect(() => {
        var isFavourite = favouritesItems.filter(item => item == productUrl).length > 0;
        setIsFavourited(isFavourite);
    }, [favouritesItems])

    async function checkIfProductExists() {
        try {
            setIsLoading(true);
            var response = await axiosClient.get(`${baseProductsURL()}api/products/exists/${productUrl}`);
            setIsLoading(false);
            setIsSuccess(true);
            return true;
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                setIsLoading(false);
                setIsSuccess(false);
            }
            return false;
        }
    }

    async function fethData() {
        var result = await checkIfProductExists();

        if (result) {
            await fetchProduct();
        }
    }

    async function fetchProduct() {
        try {
            var result = await axiosClient.get(`${baseProductsURL()}api/products/${productUrl}`);
            var data = result.data as Product;
            setProduct(data);
            document.title = data.name[language.code];
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
        }
    }

    async function addToShoppingCart() {
        if (product != null) {
            var shoppingCartItem: ShoppingCartItem = {
                coverTags: product.coverTags,
                imageUrl: product.coverImageUrl,
                name: product.name,
                number: 1,
                price: product.price,
                productUrl: productUrl ?? ""
            }
            addShoppingCartItem(shoppingCartItem);
        }
    }

    function onAddedReview(review: ProductReview) {
        var newReviews = product?.reviews;
        newReviews?.push(review);
        setProduct(prevProduct => {
            return {
                ...prevProduct!,
                reviews: newReviews!
            }
        })
    }

    function onRemovedReview(review: ProductReview) {
        var newReviews = product?.reviews.filter(r => r != review);
        setProduct(prevProduct => {
            return {
                ...prevProduct!,
                reviews: newReviews!
            }
        })
    }

    function changeFavourite(isFavourited: boolean) {
        if (isFavourited) {
            removeFavourite(product?.productUrl ?? '');
            setIsFavourited(false);
        }
        else {
            addFavourite(product?.productUrl ?? '');
            setIsFavourited(true);
        }
    }

    if (isLoading) {
        return (
            <div className="w-screen flex justify-center">
                <Spinner />
            </div>)
    }

    if (!isSuccess && !isLoading) {
        return (
            <div className="h-screen">
                <NotFoundComponent />
            </div>
        )
    }

    return (
        <div className="grid md:grid-cols-12">
            <div className="md:col-start-3 md:col-span-8">
                <div className="py-2">
                    <div className="flex">
                        <div className="p-5">
                            <div className="h-56 w-40 md:h-full md:w-80">
                                <div className="relative">
                                    <img src={product?.pictureUrls[0]} alt="product" />
                                    <FontAwesomeIcon icon={['fas', 'bookmark']} size="2x"
                                        className={`absolute top-0 right-0 m-2 cursor-pointer
                                        ${isFavourited == true ? 'text-orange-500 hover:text-orange-600' :
                                                ' text-black hover:text-orange-600'}`}
                                        onClick={() => changeFavourite(isFavourited)} />
                                </div>
                            </div>
                            <div>
                            </div>
                        </div>
                        <div className="p-5 grid grid-rows-2">
                            <div className="">
                                <span className="text-black dark:text-white text-2xl line-clamp-2">{product?.name[language.code]}</span>
                                {product != null && Object.entries(product?.coverTags[language.code]).map(([key, value]) => {
                                    return (
                                        <div key={key} className="text-gray-500">
                                            <span>{key}: {value}</span>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="grid items-end">
                                <div className="flex flex-col items-center">
                                    <div className="text-black dark:text-white">
                                        <span>{t('price')}: </span>
                                        <span >{product?.price}</span>
                                    </div>
                                    <button className="px-5 py-2 w-28 bg-orange-600 rounded-lg hover:bg-orange-700"
                                        onClick={() => addToShoppingCart()}>
                                        <div className="flex gap-1 items-center justify-center text-white">
                                            <FontAwesomeIcon icon={['fas', 'shopping-cart']} />
                                            <span>{t('buy')}</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid text-black dark:text-white">
                        <h1 className="py-10 text-2xl font-bold justify-self-center">{t('description')}</h1>
                        <div>
                            {product?.description[language.code]}
                        </div>
                    </div>
                    <div className="grid text-black dark:text-white ">
                        <h1 className="pt-10 pb-4 text-2xl font-bold justify-self-center">{t('allCharacteristics')}</h1>
                        <div className="bg-white dark:bg-slate-600 rounded-lg p-2 shadow-lg">
                            <div className="grid grid-cols-4">
                                <span className="md:justify-self-end">{t('categories')}:</span>
                                <div className="px-2">
                                    {product?.categories.map((item, index) => {
                                        return (
                                            <div key={index}>
                                                <Link to={`/category/${item.urlPath}`} className="text-blue-600 hover:text-blue-500">
                                                    {item.displayName[language.code]}
                                                </Link>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="md:grid md:grid-cols-2">
                                {product?.tags != null && Object.entries(product.tags[language.code]).map(([key, value]) => {
                                    return (
                                        <div key={key} className="md:grid md:grid-cols-2">
                                            <span className="md:justify-self-end">{key} :</span>
                                            <span className="px-2">{value}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <Reviews product={product} onAddedReview={onAddedReview} onRemoveReview={onRemovedReview} />
                    </div>
                </div>
            </div>
        </div>
    )
}