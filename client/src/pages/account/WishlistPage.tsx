import { useTranslation } from "react-i18next";
import { useTitle } from "../../components";
import { useFavourites, useLanguage } from "../../contexts";
import { useEffect, useState } from "react";
import axios from "axios";
import { Product, authClient, axiosClient, baseProductsURL } from "../../utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { Image } from "@/components/utilities";

export default function WishlistPage() {
    const { t } = useTranslation();
    useTitle(t('title.wishlist'));

    const [products, setProducts] = useState<Product[]>();

    const { favouritesItems, removeFavourite } = useFavourites();
    const { language } = useLanguage();

    useEffect(() => {
        async function fetchData() {
            try {
                var response = await axiosClient.post(`${baseProductsURL()}api/products/get-by-urls`, { productUrls: favouritesItems });
                var data = response.data as Product[];
                setProducts(data);
            }
            catch (error) {
                if (axios.isAxiosError(error)) {

                }
            }
        }

        fetchData();
    }, [favouritesItems])

    async function onRemoveFavourite(favourite: string) {
        try {
            var response = await authClient.delete(`${baseProductsURL()}api/favourites/remove/${favourite}`)
            setProducts(products?.filter(p => p.productUrl != favourite));
            removeFavourite(favourite);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
        }
    }

    return (
        <section className="mt-5">
            {products?.map((item, index) => {
                return (
                    <div key={index} className="flex justify-between p-5 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-lg mx-2 md:mx-0">
                        <Link to={`/product/${item.productUrl}`} className="flex gap-1">
                            <div className="relative w-48">
                                <Image src={`${baseProductsURL()}${item.coverImageUrl}`} alt="product" className="rounded-lg" />
                                {!item.isAvailable &&
                                    <div className="absolute w-24 bottom-7 -right-2 text-center bg-red-600 rounded-lg -rotate-45">
                                        <span>Изчерпан</span>
                                    </div>
                                }
                                {item.discount > 0 &&
                                    <div className="absolute w-24 top-7 -left-2 text-center bg-orange-600 rounded-lg -rotate-45">
                                        <span>-{item.discount}%</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <span>{item.name.find(name => name.key == language.code)?.value}</span>
                            </div>
                        </Link>
                        <div className="h-fit px-1 hover:bg-gray-300 hover:dark:bg-gray-500 cursor-pointer">
                            <FontAwesomeIcon icon={['fas', 'x']} className="text-red-600"
                                onClick={() => onRemoveFavourite(item.productUrl)} />
                        </div>
                    </div>
                )
            })}
        </section>
    )
}