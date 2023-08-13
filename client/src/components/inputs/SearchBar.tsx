import { useLanguage } from "@/contexts";
import { SearchCategory, SearchProduct, axiosClient, baseProductsURL } from "@/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Separator } from "../ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { Image } from "../utilities";

interface Props {

}

export default function SearchBar(props: Props) {
    const [results, setResults] = useState<SearchProduct[]>([]);
    const [showResults, setShowResults] = useState<boolean>(false);

    const [popularProducts, setPopularProducts] = useState<SearchProduct[]>([]);
    const [popularCategories, setPopularCategories] = useState<SearchCategory[]>([]);
    const [arePopularVisible, setArePopularVisible] = useState<boolean>(false);

    const navigate = useNavigate();
    const { language } = useLanguage();

    const divRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    async function fetchPopularProducts() {
        try {
            var result = await axiosClient.get(`${baseProductsURL()}api/products/visits/most-popular`);

            var data = result.data as SearchProduct[];
            setPopularProducts(data);
            setArePopularVisible(true);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
        }
    }

    async function fetchPopularCategories() {
        try {
            var result = await axiosClient.get(`${baseProductsURL()}api/categories/visits/most-popular`);

            var data = result.data as SearchCategory[];
            setPopularCategories(data);
            setArePopularVisible(true);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
        }
    }

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (divRef.current && !divRef.current.contains(target)) {
            setShowResults(false);
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside, true)

        fetchPopularProducts();
        fetchPopularCategories();

        return () => {
            document.removeEventListener('mousedown', handleClickOutside, true)
        }
    }, [])

    async function onSearchTextChanged(text: string) {
        if (text.length == 0) {
            setResults([]);
            setArePopularVisible(true);
            return;
        }
        try {
            var result = await axiosClient.get(`${baseProductsURL()}api/products/search/${text}`);

            var data = result.data as SearchProduct[];

            setResults(data);
            setArePopularVisible(false);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
        }
    }

    function onKeydown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key == 'Enter') {
            if (inputRef.current?.value == "")
                navigate('/');
            else
                navigate(`/search/${event.currentTarget.value}`);
            setShowResults(false);
            inputRef?.current?.blur();
        }
    }

    function onClearButtonClicked() {
        inputRef.current!.value = '';
        onSearchTextChanged('');
        inputRef?.current?.focus();
    }

    return (
        <div ref={divRef} className="w-full relative" >
            <div className="flex justify-between items-center border rounded-lg">
                <div className="flex items-center w-full">
                    <FontAwesomeIcon icon={['fas', 'search']} className="text-black dark:text-white p-1" />
                    <input id="search" ref={inputRef} autoComplete="off"
                        className="bg-transparent text-black dark:text-white outline-none p-1 w-full"
                        onChange={(e) => onSearchTextChanged(e.target.value)}
                        onFocus={() => setShowResults(true)}
                        onKeyDown={(e) => onKeydown(e)}
                    />
                </div>
                {inputRef.current != null && inputRef.current.value.length > 0 &&
                    <FontAwesomeIcon icon={['fas', 'x']}
                        className="text-black dark:text-white mr-2 cursor-pointer
                             hover:text-red-600 dark:hover:text-red-600"
                        onClick={() => onClearButtonClicked()} />
                }
            </div>
            {showResults &&
                <div className="absolute w-full bg-white dark:bg-gray-800 
                text-black dark:text-white border-l border-r border-b px-1z-[60]">
                    {arePopularVisible &&
                        <div>
                            <h1 className="font-bold px-1">Най-популярни продукти</h1>
                            {popularProducts.map((product, index) => {
                                return (
                                    <Link to={`product/${product.productUrl}`} key={index}
                                        onClick={() => setShowResults(false)}>
                                        <div className="grid grid-cols-12 place-items-start items-center hover:bg-gray-300 hover:dark:bg-gray-600">
                                            <div className="relative col-span-2">
                                                <Image src={`${baseProductsURL()}${product.coverImageUrl}`} alt="product"/>
                                                {product.discount > 0 &&
                                                    <div className="absolute w-12 top-3 -left-1 text-center bg-orange-600 rounded-lg -rotate-45">
                                                        <span>-{product.discount}%</span>
                                                    </div>
                                                }
                                            </div>
                                            <div className="grid col-span-10 px-1">
                                                <span>{product.name.find(name => name.key == language.code)?.value}</span>
                                                <div className="line-clamp-2 text-gray-600 dark:text-gray-400 break-words">
                                                    {product.description.find(desc => desc.key == language.code)?.value}
                                                </div>
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
                                            </div>
                                            <Separator className="my-2 col-span-12 dark:bg-gray-600" />
                                        </div>
                                    </Link>
                                )
                            })}
                            <h1 className="font-bold px-1">Най-популярни категории</h1>
                            {popularCategories.map((category, index) => {
                                return (
                                    <div key={index} className="flex">
                                        <Link to={`category/${category.urlPath}`}
                                            onClick={() => setShowResults(false)}
                                            className="w-full px-1 hover:bg-gray-300 hover:dark:bg-gray-600">
                                            {category.displayName.find(c => c.key == language.code)?.value}
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    }
                    {results != undefined && results.length > 0 ?
                        (<div>
                            <h1 className="font-bold">Продукти</h1>
                            {results.map((product, index) => {
                                return (
                                    <Link to={`product/${product.productUrl}`} key={index}
                                        onClick={() => setShowResults(false)}>
                                        <div className="grid grid-cols-12 place-items-start items-center hover:bg-gray-300 hover:dark:bg-gray-600">
                                            <div className="relative col-span-2">
                                            <Image src={`${baseProductsURL()}${product.coverImageUrl}`} alt="product"/>
                                                {product.discount > 0 &&
                                                    <div className="absolute w-12 top-3 -left-1 text-center bg-orange-600 rounded-lg -rotate-45">
                                                        <span>-{product.discount}%</span>
                                                    </div>
                                                }
                                            </div>
                                            <div className="grid col-span-10 px-1">
                                                <span>{product.name.find(name => name.key == language.code)?.value}</span>
                                                <div className="line-clamp-2 text-gray-400 break-words">
                                                    {product.description.find(desc => desc.key == language.code)?.value}
                                                </div>
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
                                            </div>
                                            <Separator className="my-2 col-span-12 dark:bg-gray-600" />
                                        </div>
                                    </Link>
                                )
                            })}
                            <Link
                                to={`/search/${inputRef.current?.value}`}
                                className="hover:bg-gray-600 flex"
                                onClick={() => setShowResults(false)}>
                                Виж всички резултати
                            </Link>
                        </div>) : (
                            <>
                                {!arePopularVisible &&
                                    <h1>Не са намерени продукти</h1>
                                }
                            </>
                        )
                    }
                </div>
            }
        </div>
    )
}