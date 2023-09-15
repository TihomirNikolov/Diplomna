import { useTranslation } from "react-i18next";
import { useTitle } from "../components";
import axios from "axios";
import { authClient, baseProductsURL } from "@/utilities";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts";
import { SearchCategoryWithProducts } from "@/utilities/models/store/Category";
import { Carousel } from "react-responsive-carousel";
import card from '../assets/empty-card.png'
import react from '../assets/react.svg'
import { Image } from "@/components/utilities";

import { Skeleton } from "@/components/ui/skeleton";
import { ProductsCarousel } from "@/components/navigation";
import { Link } from "react-router-dom";

export default function HomePage() {
    const { t } = useTranslation();
    useTitle(t('title.home'));

    const [categories, setCategories] = useState<SearchCategoryWithProducts[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { language } = useLanguage();

    async function fetchUserCategories() {
        try {
            setIsLoading(true);
            var result = await authClient.get(`${baseProductsURL()}api/categories/user`);
            var data = result.data as SearchCategoryWithProducts[];
            setCategories(data);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
        }
        setIsLoading(false);
    }

    useEffect(() => {
        fetchUserCategories();
    }, [])

    return (
        <div className="grid grid-cols-12 px-2">
            <div className="md:col-start-3 col-span-12 md:col-span-8">
                <section className="mt-5 flex w-full justify-center">
                    {/* <Carousel className="w-full md:w-1/2" infiniteLoop autoPlay interval={5000} showStatus={false} showThumbs={false}>
                        <div>
                            <Image src={card} alt="card" />
                        </div>
                        <div>
                            <Image src={react} alt="react" />
                        </div>
                    </Carousel> */}
                </section>
                {isLoading ?
                    <div className="flex flex-col space-y-2">
                        {new Array(3).fill(null).map((_, index) => {
                            return (
                                <div key={index} className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    {new Array(6).fill(null).map((_, index) => {
                                        return (
                                            <div className="flex flex-col space-y-2" key={index}>
                                                <Skeleton className="h-56 w-48" />
                                                <Skeleton className="h-8 w-48" />
                                                <Skeleton className="h-24 w-48" />
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>
                    :
                    <div>
                        {categories.map((category, _) => {
                            return (
                                <section key={category.urlPath} className="py-5">
                                    <div className="flex mb-2 justify-between text-black dark:text-white ">
                                        <h1 className="text-2xl font-bold">
                                            {category.displayName.find(c => c.key == language.code)?.value}
                                        </h1>
                                        <Link to={`category/${category.urlPath}`}>
                                            {t('viewAll')}
                                        </Link>
                                    </div>
                                    <ProductsCarousel products={category.products} />
                                </section>
                            )
                        })}
                    </div>
                }
            </div>
        </div>
    )
}