import { CategoryFiltersHandle } from "@/components/store/CategoryFIlters"
import { SortingHandle } from "@/components/store/SortingComponent"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router-dom"
import { CategoryFilters, CoverProductCard, NotFoundComponent, Pagination, SortingComponent, useTitle } from "../../components"
import { useLanguage, useUser } from "../../contexts"
import { CategoryDTO, CoverProduct, Filter, Item, SortType, authClient, axiosClient, baseProductsURL, sortingParams } from "../../utilities"

export default function CategoryPage() {
    const { t } = useTranslation();
    useTitle(t('category'));

    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

    const [productsCount, setProductsCount] = useState<number>(0);
    const [filteredCount, setFilteredCount] = useState<number>(0);

    const [products, setProducts] = useState<CoverProduct[]>([])
    const [category, setCategory] = useState<CategoryDTO>();
    const [filters, setFilters] = useState<Item<Item<string, string>[], Filter>[]>([]);
    const [checkedFilters, setCheckedFilters] = useState<{ key: string, values: string[] }[]>([]);

    const [isCategoryLoading, setIsCategoryLoading] = useState<boolean>(true);
    const [areProductsLoading, setAreProductsLoading] = useState<boolean>(true);

    const [isCategoryFound, setIsCategoryFound] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(40);
    const [sorting, setSorting] = useState<SortType>('newest');

    const location = useLocation();
    const { language } = useLanguage();
    const { isAuthenticated } = useUser();

    const sortingRef = useRef<SortingHandle>(null);
    const filtersRef = useRef<CategoryFiltersHandle>(null);

    useEffect(() => {
        setCategory(undefined);
        async function fetchData() {
            var result = await fetchIfExists();

            if (result) {
                var categoryDTO: CategoryDTO | null = await fetchCategoryData();
                var { sorting, checkedFilters } = applyFilters();
                await fetchProducts(categoryDTO, currentPage, itemsPerPage, checkedFilters, sorting);
            }
        }
        fetchData();
    }, [location.pathname])

    useEffect(() => {
        if (!isInitialLoad)
            applyFilters();
        setIsInitialLoad(false);
    }, [location.search])

    async function fetchProducts(category: CategoryDTO | null, page: number, itemsPerPage: number, checkedFilters: { key: string, values: string[] }[], sorting: SortType) {
        try {
            setAreProductsLoading(true);
            var response = await axiosClient.post(`${baseProductsURL()}api/products/category/${category?.displayName.find(name => name.key == language.code)?.value}/${page}/${itemsPerPage}`,
                { checkedFilters: checkedFilters, sortingType: sorting });
            var data = response.data as { products: CoverProduct[], count: number};
            setProducts(data.products);
            if(checkedFilters.length == 0){
                setFilteredCount(productsCount);
            }
            else{
                setFilteredCount(data.count);
            }
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
            console.log(error);
        }
        finally {
            setAreProductsLoading(false);
        }
    }

    async function fetchCategoryData() {
        try {
            setIsCategoryLoading(true);
            var url = encodeURIComponent(location.pathname.split('/category/')[1]);
            if (isAuthenticated) {
                var response = await authClient.get(`${baseProductsURL()}api/categories/${url}`);
            }
            else {
                var response = await axiosClient.get(`${baseProductsURL()}api/categories/${url}`);
            }
            var data = response.data as { category: CategoryDTO, numberOfProducts: number, tags: Item<Item<string, string>[], Filter>[] };
            setCategory(data.category);
            setProductsCount(data.numberOfProducts);
            setFilteredCount(data.numberOfProducts);
            setFilters(data.tags);
            return data.category;
        }
        catch (error) {
            return null;
        }
        finally {
            setIsCategoryLoading(false);
        }
    }

    async function fetchIfExists() {
        try {
            var url = encodeURIComponent(location.pathname.split('/category/')[1]);
            await axiosClient.get(`${baseProductsURL()}api/categories/exists/${url}`);
            setIsCategoryFound(true);
            return true;
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
            setIsCategoryFound(false);
            return false;
        }
    }

    function applyFilters() {
        var urlSearchParams = new URLSearchParams(location.search);
        var params = Object.fromEntries(urlSearchParams.entries());
        if (urlSearchParams.size == 0) {
            return { sorting: 'newest', checkedFilters: [] };
        }

        var checkedFilters: { key: string, values: string[] }[] = [];
        var sort: SortType = sorting;
        for (var [key, value] of Object.entries(params)) {
            if (!sortingParams.includes(key)) {
                var values = value.split('|');
                checkedFilters.push({ key: key, values: values });
            }
            else if (isInitialLoad) {
                if (key == 'sort') {
                    sort = value;
                    setSorting(value);
                } else if (key == 'items') {
                    setItemsPerPage(parseInt(value))
                } else if (key == 'page') {
                    setCurrentPage(parseInt(value));
                }
            }
        }
        setCheckedFilters(checkedFilters);

        if (!isInitialLoad) {
            fetchProducts(category!, currentPage, itemsPerPage, checkedFilters, sort);
        }

        return { sorting: sort, checkedFilters: checkedFilters }
    }

    function onItemsPerPageChanged(productsPerPage: number) {
        setCurrentPage(1);
    }

    function onSortingTypeChanged(sortingType: SortType) {
        setCurrentPage(1);
    }

    function onPageChanged(page: number) {
        setCurrentPage(page);
        fetchProducts(category!, page, itemsPerPage, checkedFilters, sorting);
    }

    if (!isCategoryFound && !isCategoryLoading) {
        return (
            <NotFoundComponent />
        )
    }

    return (
        <div className="grid grid-cols-12">
            <div className="lg:col-start-3 col-span-2 hidden md:flex md:flex-col md:mr-2 ml-2 lg:ml-0">
                <h1 className="text-black dark:text-white font-bold text-2xl mt-5">{t('categories')}</h1>
                {isCategoryLoading ?
                    <Skeleton className="h-24" />
                    :
                    <>
                        {category?.subCategories?.map((subCategory, index) => {
                            return (
                                <div key={index} className="text-black dark:text-white flex flex-col">
                                    <div>
                                        <FontAwesomeIcon icon={['fas', 'chevron-right']} className="pr-2 text-orange-500" />
                                        <Link to={`/category/${subCategory.urlPath}`}
                                            className={`hover:text-orange-500 hover:dark:text-orange-500 
                                ${category?.displayName.find(name => name.key == language.code)?.value == subCategory.displayName.find(name => name.key == language.code)?.value
                                                    ? 'text-orange-500 dark:text-orange-500' : ''}`}>
                                            {subCategory.displayName.find(name => name.key == language.code)?.value}
                                        </Link>
                                    </div>
                                </div>)
                        })}
                    </>
                }
                {isCategoryLoading ?
                    <Skeleton className="mt-4 h-56 w-full" />
                    :
                    <>
                        {category != undefined && products != undefined && products.length > 0 &&
                            <section>
                                <Separator className="mt-4" />
                                <CategoryFilters ref={filtersRef}
                                    filters={filters}
                                    checkedFilters={checkedFilters}
                                    setCheckedFilters={setCheckedFilters} />
                            </section>
                        }
                    </>
                }
            </div>
            <div className="lg:col-start-5 lg:col-span-6 col-start-2 col-span-10 md:col-start-3 md:col-span-9">
                {isCategoryLoading ?
                    <div className="py-5">
                        <Skeleton className="h-12" />
                    </div>
                    :
                    <h1 className="text-black dark:text-white font-bold text-4xl py-5 flex items-center justify-center">
                        {category?.displayName.find(name => name.key == language.code)?.value}
                    </h1>
                }

                <div className="flex flex-col gap-5">
                    <section className="flex flex-col gap-4 pb-2 border-b">
                        {isCategoryLoading ?
                            <Skeleton className="h-36" />
                            :
                            <>
                                <div className="flex gap-4 items-center justify-center">
                                    <SortingComponent
                                        ref={sortingRef}
                                        disabled={areProductsLoading}
                                        onItemsPerPageChanged={onItemsPerPageChanged}
                                        onSortingTypeChanged={onSortingTypeChanged}
                                        itemsPerPage={itemsPerPage}
                                        setItemsPerPage={setItemsPerPage}
                                        sorting={sorting}
                                        setSorting={setSorting} />
                                </div>
                                <div className="flex items-center justify-center">
                                    <Pagination
                                        disabled={areProductsLoading}
                                        currentPage={currentPage}
                                        onPageChanged={onPageChanged}
                                        items={filteredCount} />
                                </div>

                                <div className="flex items-center justify-start text-black dark:text-white">
                                    <span>{t('foundResults')}: &nbsp;</span>
                                    <span>{filteredCount}</span>
                                </div>
                            </>
                        }
                    </section>

                    <section className="flex flex-wrap gap-4 justify-center md:justify-start">
                        {areProductsLoading ?
                            <>
                                {new Array(10).fill(null).map((_, index) => {
                                    return (
                                        <div className="flex flex-col space-y-2" key={index}>
                                            <Skeleton className="h-56 w-48" />
                                            <Skeleton className="h-8 w-48" />
                                            <Skeleton className="h-24 w-48" />
                                        </div>
                                    )
                                })}
                            </>
                            :
                            <>
                                {products.map((product, index) => {
                                    return (
                                        <CoverProductCard key={index} product={product} />
                                    )
                                })}
                            </>
                        }
                    </section>
                    <section className="flex items-center justify-center border-t pt-2">
                        {isCategoryLoading ?
                            <Skeleton className="h-12 w-full" />
                            :
                            <Pagination
                                disabled={areProductsLoading}
                                currentPage={currentPage}
                                onPageChanged={onPageChanged}
                                items={filteredCount} />
                        }
                    </section>
                </div>
            </div>
        </div>
    )
}