import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Product, ProductReview, axiosClient, baseProductsURL } from "../../utilities";
import axios from "axios";
import { NotFoundComponent, Reviews, Spinner } from "../../components";
import { ShoppingCartItem, useFavourites, useLanguage, useShoppingCart, useUser } from "../../contexts";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { Image } from "@/components/utilities";
import { Carousel } from "react-responsive-carousel";

export default function ProductPage() {
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [isProductFound, setIsProductFound] = useState<boolean>(false);

    const [product, setProduct] = useState<Product>();
    const [isFavourited, setIsFavourited] = useState<boolean>(false);

    const { addShoppingCartItem } = useShoppingCart();
    const { favouritesItems, addFavourite, removeFavourite } = useFavourites();
    const { language } = useLanguage();
    const { isAuthenticated } = useUser();

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
            var response = await axiosClient.get(`${baseProductsURL()}api/products/exists/${productUrl}`);
            setIsProductFound(true);
            return true;
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
            setIsProductFound(false);
            return false;
        }
    }

    async function fethData() {
        var result = await checkIfProductExists();

        if (result) {
            setIsLoading(true);
            await fetchProduct();
            setIsLoading(false);
        }
    }

    async function fetchProduct() {
        try {
            var result = await axiosClient.get(`${baseProductsURL()}api/products/${productUrl}`);
            var data = result.data as Product;
            setProduct(data);
            document.title = data.name.find(name => name.key == language.code)?.value || "";
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
                productUrl: productUrl ?? "",
                productId: product.id,
                discount: product.discount,
                storeId: product.storeId,
                discountedPrice: product.discountedPrice
            }
            await addShoppingCartItem(shoppingCartItem);
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

    if (!isProductFound && !isLoading) {
        return (
            <div className="h-screen">
                <NotFoundComponent />
            </div>
        )
    }

    return (
        <div className="grid md:grid-cols-12">
            <div className="md:col-start-3 md:col-span-8">
                <section className="flex">
                    {isLoading ?
                        <div className="p-5">
                            <Skeleton className="h-56 w-40 md:h-[426px] md:w-80" />
                        </div>
                        :
                        <div className="p-5">
                            <div className="h-56 w-40 md:h-full md:w-80">
                                <div className="relative">
                                    <Carousel showThumbs showStatus={false} showIndicators={false}>
                                        {product?.pictureUrls.map((url, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    <img src={`${baseProductsURL()}${url}`} alt="product" className="rounded-lg" />
                                                </React.Fragment>
                                            )
                                        })}
                                    </Carousel>
                                    {!product!.isAvailable &&
                                        <div className="absolute w-24 bottom-7 -right-2 text-center bg-red-600 rounded-lg -rotate-45">
                                            <span>Изчерпан</span>
                                        </div>
                                    }
                                    {product!.discount > 0 &&
                                        <div className="absolute w-24 top-7 -left-2 text-center bg-orange-600 rounded-lg -rotate-45">
                                            <span>-{product?.discount}%</span>
                                        </div>
                                    }
                                    {isAuthenticated &&
                                        <FontAwesomeIcon icon={['fas', 'bookmark']} size="2x"
                                            className={`absolute top-0 right-0 m-2 cursor-pointer
                                                                        ${isFavourited == true ? 'text-orange-500 hover:text-orange-600' :
                                                    ' text-black hover:text-orange-600'}`}
                                            onClick={() => changeFavourite(isFavourited)} />
                                    }
                                </div>
                            </div>
                        </div>
                    }
                    {isLoading ?
                        <div className="p-5 flex flex-col justify-between w-full">
                            <Skeleton className="h-28" />
                            <Skeleton className="h-40" />
                            <Skeleton className="h-28" />
                        </div>
                        :
                        <div className="p-5 grid grid-rows-2">
                            <div>
                                <span className="text-black dark:text-white text-2xl line-clamp-2">{product?.name.find(name => name.key == language.code)?.value}</span>
                                {product != null && product?.coverTags.find(tag => tag.key == language.code)?.value.map((item, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            <span className="text-gray-500">{item.key}: {item.value}</span>
                                        </React.Fragment>
                                    )
                                })}
                            </div>
                            <div className="grid items-end">
                                <div className="flex flex-col items-center">
                                    <div className="text-black dark:text-white flex space-x-1">
                                        <span>{t('price')}: </span>
                                        <div>
                                            {product != null &&
                                                <>
                                                    {product.discount > 0 ?
                                                        <div className="flex space-x-1">
                                                            <span className="line-through decoration-red-600 decoration-2">
                                                                {product.price.toFixed(2)} лв.
                                                            </span>
                                                            <span>
                                                                {product.discountedPrice.toFixed(2)} лв.
                                                            </span>
                                                        </div> :
                                                        <>
                                                            <span>{product.price.toFixed(2)} лв.</span>
                                                        </>
                                                    }
                                                </>
                                            }
                                        </div>
                                    </div>
                                    {product?.isAvailable ?
                                        <button className="px-5 py-2 w-28 bg-orange-600 rounded-lg hover:bg-orange-700"
                                            onClick={() => addToShoppingCart()}>
                                            <div className="flex gap-1 items-center justify-center text-white">
                                                <FontAwesomeIcon icon={['fas', 'shopping-cart']} />
                                                <span>{t('buy')}</span>
                                            </div>
                                        </button>
                                        :
                                        <div>
                                            <span className="text-lg font-bold text-black dark:text-white">Продуктът е изчерпан</span>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    }
                </section>
                <section className="grid text-black dark:text-white">
                    {isLoading ?
                        <div className="py-10">
                            <Skeleton className="h-36" />
                        </div>
                        :
                        <>
                            <h1 className="py-10 text-2xl font-bold justify-self-center">{t('description')}</h1>
                            <div>
                                <span>
                                    {product?.description.find(desc => desc.key == language.code)?.value}
                                </span>
                            </div>
                        </>
                    }
                </section>
                <div className="grid text-black dark:text-white ">
                    {isLoading ?
                        <div>
                            <Skeleton className="h-56" />
                        </div>
                        :
                        <>
                            <h1 className="pt-10 pb-4 text-2xl font-bold justify-self-center">{t('allCharacteristics')}</h1>
                            <section className="bg-white dark:bg-slate-600 rounded-lg p-2 shadow-lg">
                                <div className="grid grid-cols-4">
                                    <span className="md:justify-self-end">{t('categories')}:</span>
                                    <div className="px-2">
                                        {product?.categories.map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    <Link to={`/category/${item.urlPath}`} className="text-blue-600 hover:text-blue-500">
                                                        {item.displayName.find(name => name.key == language.code)?.value}
                                                    </Link>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="md:grid md:grid-cols-2">
                                    {product?.tags != null && product.tags.find(tag => tag.key == language.code)?.value.map((item, index) => {
                                        return (
                                            <div key={index} className="md:grid md:grid-cols-2">
                                                <span className="md:justify-self-end">{item.key} :</span>
                                                <span className="px-2">{item.value}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </section>
                        </>
                    }
                    {isLoading ?
                        <div className="mt-10">
                            <Skeleton className="h-56" />
                        </div>
                        :
                        <Reviews product={product} onAddedReview={onAddedReview} onRemoveReview={onRemovedReview} />
                    }
                </div>
            </div>
        </div>
    )
}