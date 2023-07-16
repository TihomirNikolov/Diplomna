import { Fragment, useEffect, useState } from "react"
import { CategoryDTO, CoverProduct, Dictionary, Filter, SortType, axiosClient, baseProductsURL, sortings } from "../../utilities"
import axios from "axios"
import { CategoryFilters, CoverProductCard, NotFoundComponent, Pagination, Spinner, useTitle } from "../../components"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Listbox, Transition } from "@headlessui/react"
import { useTranslation } from "react-i18next"
import { useLanguage } from "../../contexts"
import { Separator } from "@/components/ui/separator"

export default function CategoryPage() {
    const { t } = useTranslation();
    useTitle(t('category'));

    const [products, setProducts] = useState<CoverProduct[]>([])
    const [filteredProducts, setFilteredProducts] = useState<CoverProduct[]>([]);
    const [category, setCategory] = useState<CategoryDTO>();

    const [showProducts, setShowProducts] = useState<CoverProduct[]>([]);

    const [selectedCategory, setSelectedCategory] = useState<CategoryDTO>();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(40);
    const [sorting, setSorting] = useState<SortType>('newest');

    const navigate = useNavigate();
    const location = useLocation();

    const { language } = useLanguage();

    useEffect(() => {
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
    }, [location.search])

    async function fetchProducts(category: CategoryDTO | null) {
        try {
            var response = await axiosClient.get(`${baseProductsURL()}api/products/category/${category?.displayName[language.code]}`);
            var products = response.data as CoverProduct[];
            var sortedProducts: CoverProduct[] = sortProducts(sorting, products)!;
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
            setSelectedCategory(data);
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
            calculateProductsToShow(products, 1, itemsPerPage);
            return;
        }
        var filtredProducts: CoverProduct[] = products;
        for (var [key, value] of Object.entries(params)) {
            if (key == 'sort') {
                setSorting(value);
            } else if (key == 'items') {
                setItemsPerPage(parseInt(value))
            } else if (key == 'page') {
                setCurrentPage(parseInt(value));
            } else {
                var values = value.split('|');

                filtredProducts = filtredProducts.filter(p => p.tags[language.code][key] != undefined && values.includes(p.tags[language.code][key]));
            }
        }

        setFilteredProducts(filtredProducts);
        calculateProductsToShow(filtredProducts, 1, itemsPerPage);
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

    function changeSorting(sortingType: SortType) {
        setSorting(sortingType);

        var searchParams: URLSearchParams = new URLSearchParams(location.search);

        searchParams.set('sort', sortingType);
        navigate(`?${searchParams.toString()}`);
    }

    function changeItemsPerPage(itemsPerPage: number) {
        setItemsPerPage(itemsPerPage);

        var searchParams: URLSearchParams = new URLSearchParams(location.search);

        searchParams.set('items', itemsPerPage.toString());
        navigate(`?${searchParams.toString()}`);
    }

    function onItemsPerPageChanged(productsPerPage: number) {
        var currentPageStart = (currentPage - 1) * itemsPerPage;
        var newCurrentPage = Math.ceil((currentPageStart + 1) / productsPerPage);

        setCurrentPage(newCurrentPage);
        calculateProductsToShow(filteredProducts, newCurrentPage, productsPerPage);
    }

    function onSortingTypeChanged(sortingType: SortType) {
        sortProducts(sortingType, filteredProducts);
        calculateProductsToShow(filteredProducts, currentPage, itemsPerPage);
    }

    function onPageChanged(page: number) {
        setCurrentPage(page);
        calculateProductsToShow(filteredProducts, page, itemsPerPage);

        var searchParams: URLSearchParams = new URLSearchParams(location.search);

        searchParams.set('page', page.toString());
        navigate(`?${searchParams.toString()}`);
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
                                ${selectedCategory?.displayName == subCategory.displayName ? 'text-orange-500 dark:text-orange-500' : ''}`}>
                                    {subCategory.displayName[language.code]}
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
                <h1 className="text-black dark:text-white font-bold text-4xl py-5 flex items-center justify-center">{category?.displayName[language.code]}</h1>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-4 pb-2 border-b">
                        <div className="flex gap-4 items-center justify-center">
                            <div>
                                <span className="text-black dark:text-white mr-2 text-sm">{t('sortBy')}:</span>
                                <Listbox value={sorting} onChange={onSortingTypeChanged}>
                                    {({ open }) => (
                                        <div className="relative w-44">
                                            <Listbox.Button className="w-full bg-white dark:bg-darkBackground-800
                                                                 text-black dark:text-white border p-1 rounded-lg">
                                                <div className="flex w-full items-center justify-between">
                                                    <span>{t(`${sorting}`)}</span>
                                                    {open == true ?
                                                        <FontAwesomeIcon icon={['fas', 'chevron-up']} /> :
                                                        <FontAwesomeIcon icon={['fas', 'chevron-down']} />}
                                                </div>
                                            </Listbox.Button>
                                            <Transition
                                                show={open}
                                                as={Fragment}
                                                enter="transition ease-out duration-200"
                                                enterFrom="opacity-0 translate-y-1"
                                                enterTo="opacity-100 translate-y-0"
                                                leave="transition ease-in duration-150"
                                                leaveFrom="opacity-100 translate-y-0"
                                                leaveTo="opacity-0 translate-y-1">
                                                <Listbox.Options className="absolute z-10 w-full bg-white dark:bg-darkBackground-800 shadow-lg rounded-lg">
                                                    {sortings.map((value, index) => {
                                                        return (
                                                            <Listbox.Option value={value} key={index} className="w-full text-center text-black py-1 dark:text-white
                                                            hover:text-orange-500 hover:dark:text-orange-500 cursor-pointer"
                                                                onClick={() => changeSorting(value)}>
                                                                {t(`${value}`)}
                                                            </Listbox.Option>
                                                        )
                                                    })}
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    )}
                                </Listbox>
                            </div>

                            <div>
                                <span className="text-black dark:text-white mr-2 text-sm">{t('showBy')}:</span>
                                <Listbox value={itemsPerPage} onChange={onItemsPerPageChanged}>
                                    {({ open }) => (
                                        <div className="relative w-44">
                                            <Listbox.Button className="w-full bg-white dark:bg-darkBackground-800
                                                                     text-black dark:text-white border p-1 rounded-lg">
                                                <div className="flex w-full items-center justify-between">
                                                    <span></span>
                                                    <span>{itemsPerPage}</span>
                                                    {open == true ?
                                                        <FontAwesomeIcon icon={['fas', 'chevron-up']} /> :
                                                        <FontAwesomeIcon icon={['fas', 'chevron-down']} />}
                                                </div>
                                            </Listbox.Button>
                                            <Transition
                                                show={open}
                                                as={Fragment}
                                                enter="transition ease-out duration-200"
                                                enterFrom="opacity-0 translate-y-1"
                                                enterTo="opacity-100 translate-y-0"
                                                leave="transition ease-in duration-150"
                                                leaveFrom="opacity-100 translate-y-0"
                                                leaveTo="opacity-0 translate-y-1">
                                                <Listbox.Options className="absolute z-10 w-full bg-white dark:bg-darkBackground-800 shadow-lg rounded-lg">
                                                    {[20, 40, 60, 80, 100].map((value, index) => {
                                                        return (
                                                            <Listbox.Option value={value} key={index} className="w-full text-center text-black py-1 dark:text-white
                                                                 hover:text-orange-500 hover:dark:text-orange-500 cursor-pointer"
                                                                onClick={() => changeItemsPerPage(value)}>
                                                                {value}
                                                            </Listbox.Option>
                                                        )
                                                    })}
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    )}
                                </Listbox>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <Pagination
                                currentPage={currentPage}
                                onPageChanged={onPageChanged}
                                items={products.length}
                                itemsPerPage={itemsPerPage} />
                        </div>

                        <div className="flex items-center justify-start text-black dark:text-white">
                            <span>{t('foundResults')}: &nbsp;</span>
                            <span>{products.length}</span>
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
                            items={products.length}
                            itemsPerPage={itemsPerPage} />
                    </div>
                </div>
            </div>

        </div>
    )
}