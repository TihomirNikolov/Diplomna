import { Fragment, useEffect, useRef, useState } from "react"
import { CategoryDTO, CoverProduct, SortType, axiosClient, baseProductsURL, sortingParams, sortings } from "../../utilities"
import axios from "axios"
import { CategoryFilters, CoverProductCard, NotFoundComponent, Pagination, SortingComponent, Spinner, useTitle } from "../../components"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Listbox, Transition } from "@headlessui/react"
import { useTranslation } from "react-i18next"
import { useLanguage } from "../../contexts"
import { Separator } from "@/components/ui/separator"
import { SortingHandle } from "@/components/store/SortingComponent"

export default function CategoryPage() {
    const { t } = useTranslation();
    useTitle(t('category'));

    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

    const [products, setProducts] = useState<CoverProduct[]>([])
    const [filteredProducts, setFilteredProducts] = useState<CoverProduct[]>([]);
    const [category, setCategory] = useState<CategoryDTO>();

    const [showProducts, setShowProducts] = useState<CoverProduct[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState<number>(1);

    const navigate = useNavigate();
    const location = useLocation();

    const { language } = useLanguage();

    const sortingRef = useRef<SortingHandle>(null);

    useEffect(() => {
        setCategory(undefined);
        async function fetchData() {
            var result = await fetchIfExists();

            if (result) {
                var categoryDTO: CategoryDTO | null = await fetchCategoryData();
                await fetchProducts(categoryDTO);
            }
        }

        fetchData();
    }, [location.pathname])

    useEffect(() => {
        applyFilters(products);
        setIsInitialLoad(false);
    }, [location.search])

    async function fetchProducts(category: CategoryDTO | null) {
        try {
            var response = await axiosClient.get(`${baseProductsURL()}api/products/category/${category?.displayName.find(name => name.key == language.code)?.value}`);
            var products = response.data as CoverProduct[];
            var sortedProducts: CoverProduct[] = sortProducts('newest', products)!;
            setProducts(sortedProducts);
            applyFilters(sortedProducts);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
        }
    }

    async function fetchCategoryData() {
        try {
            var url = encodeURIComponent(location.pathname.split('/category/')[1]);
            var response = await axiosClient.get(`${baseProductsURL()}api/categories/${url}`);
            var data = response.data as CategoryDTO;
            setCategory(data);
            return data;
        }
        catch (error) {
            return null;
        }
    }

    async function fetchIfExists() {
        try {
            setIsLoading(true);
            var url = encodeURIComponent(location.pathname.split('/category/')[1]);
            var response = await axiosClient.get(`${baseProductsURL()}api/categories/exists/${url}`);
            setIsSuccess(true);
            setIsLoading(false);
            return true;
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
            setIsSuccess(false);
            setIsLoading(false);
            return false;
        }
    }

    function applyFilters(products: CoverProduct[]) {
        var urlSearchParams = new URLSearchParams(location.search);
        var params = Object.fromEntries(urlSearchParams.entries());
        if (urlSearchParams.size == 0) {
            setFilteredProducts(products);
            calculateProductsToShow(products, 1, sortingRef.current?.itemsPerPage || 40);
            return;
        }
        var filtredProducts: CoverProduct[] = products;
        for (var [key, value] of Object.entries(params)) {
            if (!sortingParams.includes(key)) {
                var values = value.split('|');

                filtredProducts = filtredProducts.filter(p => p.tags.find(tag => tag.key == language.code)?.value != undefined
                    && values.includes(p.tags.find(t => t.key == language.code)?.value.find(t => t.key == key)?.value || ''));
            }
            else if (isInitialLoad) {
                if (key == 'sort') {
                    sortingRef.current?.setSorting(value);
                    sortProducts(value, products);
                } else if (key == 'items') {
                    sortingRef.current?.setItemsPerPage(parseInt(value))
                } else if (key == 'page') {
                    setCurrentPage(parseInt(value));
                }
            }
        }

        setFilteredProducts(filtredProducts);
        calculateProductsToShow(filtredProducts, parseInt(params['page']), parseInt(params['items']));
    }

    function calculateProductsToShow(products: CoverProduct[], page: number, itemsPerPage: number) {
        var productsToShow: CoverProduct[];
        productsToShow = products.slice((page - 1) * itemsPerPage, page * itemsPerPage);
        setShowProducts(productsToShow);
    }

    function sortProducts(sortType: SortType, products: CoverProduct[]) {
        switch (sortType) {
            case 'lowestPrice':
                var sortedProducts = products.sort((a, b) => a.price < b.price ? -1 : 1);
                setProducts(sortedProducts);
                return sortedProducts;
            case 'highestPrice':
                var sortedProducts = products.sort((a, b) => a.price > b.price ? -1 : 1);
                setProducts(sortedProducts);
                return sortedProducts;
            case 'newest':
                var sortedProducts = products.sort((a, b) => new Date(a.addedDate).getTime() > new Date(b.addedDate).getTime() ? -1 : 1);
                setProducts(sortedProducts);
                return sortedProducts;
            case 'mostCommented':
                var sortedProducts = products.sort((a, b) => a.comments > b.comments ? -1 : 1);
                setProducts(sortedProducts);
                return sortedProducts;
            case 'mostSold':
                var sortedProducts = products.sort((a, b) => a.soldAmount > b.soldAmount ? -1 : 1);
                setProducts(sortedProducts);
                return sortedProducts;
        }
    }

    function onItemsPerPageChanged(productsPerPage: number) {
        var currentPageStart = (currentPage - 1) * (sortingRef.current?.itemsPerPage!);
        var newCurrentPage = Math.ceil((currentPageStart + 1) / productsPerPage);

        setCurrentPage(newCurrentPage);
        calculateProductsToShow(filteredProducts, newCurrentPage, productsPerPage);
    }

    function onSortingTypeChanged(sortingType: SortType) {
        sortProducts(sortingType, filteredProducts);
        calculateProductsToShow(filteredProducts, currentPage, sortingRef.current?.itemsPerPage!);
    }

    function onPageChanged(page: number) {
        setCurrentPage(page);
        calculateProductsToShow(filteredProducts, page, sortingRef.current!.itemsPerPage);
    }

    if (isLoading) {
        return (
            <div className="w-screen flex justify-center">
                <Spinner />
            </div>)
    }

    if (!isSuccess && !isLoading) {
        return (
            <NotFoundComponent />
        )
    }

    return (
        <div className="grid grid-cols-12">
            <div className="lg:col-start-3 col-span-2 hidden md:flex md:flex-col md:mr-2 ml-2 lg:ml-0">
                <h1 className="text-black dark:text-white font-bold text-2xl mt-5">{t('categories')}</h1>
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
                {category != undefined && products != undefined && products.length > 0 &&
                    <div>
                        <Separator className="mt-4" />
                        <CategoryFilters category={category} products={products} />
                    </div>
                }
            </div>
            <div className="lg:col-start-5 lg:col-span-6 col-start-2 col-span-10 md:col-start-3 md:col-span-9">
                <h1 className="text-black dark:text-white font-bold text-4xl py-5 flex items-center justify-center">
                    {category?.displayName.find(name => name.key == language.code)?.value}
                </h1>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-4 pb-2 border-b">
                        <div className="flex gap-4 items-center justify-center">
                            <SortingComponent
                                ref={sortingRef}
                                onItemsPerPageChanged={onItemsPerPageChanged}
                                onSortingTypeChanged={onSortingTypeChanged} />
                        </div>
                        <div className="flex items-center justify-center">
                            <Pagination
                                currentPage={currentPage}
                                onPageChanged={onPageChanged}
                                items={filteredProducts.length} />
                        </div>

                        <div className="flex items-center justify-start text-black dark:text-white">
                            <span>{t('foundResults')}: &nbsp;</span>
                            <span>{filteredProducts.length}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        {showProducts.map((product, index) => {
                            return (
                                <CoverProductCard key={index} product={product} />
                            )
                        })}
                    </div>
                    <div className="flex items-center justify-center border-t pt-2">
                        <Pagination
                            currentPage={currentPage}
                            onPageChanged={onPageChanged}
                            items={filteredProducts.length} />
                    </div>
                </div>
            </div>

        </div>
    )
}