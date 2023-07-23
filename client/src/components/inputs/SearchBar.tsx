import { useLanguage } from "@/contexts";
import { SearchCategory, SearchProduct, baseProductsURL } from "@/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Separator } from "../ui/separator";
import { Link, useNavigate } from "react-router-dom";

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
            var result = await axios.get(`${baseProductsURL()}api/products/visits/most-popular`);

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
            var result = await axios.get(`${baseProductsURL()}api/categories/visits/most-popular`);

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
            var result = await axios.get(`${baseProductsURL()}api/products/search/${text}`);

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
            navigate(`/search/${event.currentTarget.value}`);
            setShowResults(false);
            inputRef?.current?.blur();
        }
    }

    return (
        <div ref={divRef} className="w-full relative" >
            <div className="flex items-center border rounded-lg">
                <FontAwesomeIcon icon={['fas', 'search']} className="text-black dark:text-white p-1" />
                <input id="search" ref={inputRef}
                    className="bg-transparent text-black dark:text-white outline-none p-1 w-full"
                    onChange={(e) => onSearchTextChanged(e.target.value)}
                    onFocus={() => setShowResults(true)}
                    onKeyDown={(e) => onKeydown(e)}
                />
            </div>
            {showResults &&
                <div className="absolute w-full bg-white dark:bg-gray-800 
                text-black dark:text-white border-l border-r border-b px-1z-[60]">
                    {arePopularVisible &&
                        <div>
                            <h1 className="font-bold">Най-популярни продукти</h1>
                            {popularProducts.map((product, index) => {
                                return (
                                    <Link to={`product/${product.productUrl}`} key={index}
                                        onClick={() => setShowResults(false)}>
                                        <div className="grid grid-cols-12 place-items-center hover:bg-gray-300 hover:dark:bg-gray-600">
                                            <img className="col-span-2" src={`${baseProductsURL()}${product.coverImageUrl}`} />
                                            <div className="grid col-span-10 px-1">
                                                <span>{product.name.find(name => name.key == language.code)?.value}</span>
                                                <div className="line-clamp-2 text-gray-600 dark:text-gray-400 break-words">
                                                    {product.description.find(desc => desc.key == language.code)?.value}
                                                </div>
                                                <span>{product.price} лв.</span>
                                            </div>
                                            <Separator className="my-2 col-span-12 dark:bg-gray-600" />
                                        </div>
                                    </Link>
                                )
                            })}
                            <h1 className="font-bold">Най-популярни категории</h1>
                            {popularCategories.map((category, index) => {
                                return (
                                    <div key={index} className="flex">
                                        <Link to={`category/${category.urlPath}`}
                                            onClick={() => setShowResults(false)}
                                            className="w-full hover:bg-gray-300 hover:dark:bg-gray-600">
                                            {category.displayName.find(c => c.key == language.code)?.value}
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    }
                    {results != undefined && results.length > 0 &&
                        <div>
                            <h1 className="font-bold">Продукти</h1>
                            {results.map((product, index) => {
                                return (
                                    <Link to={`product/${product.productUrl}`} key={index}
                                        onClick={() => setShowResults(false)}>
                                        <div className="grid grid-cols-12 place-items-center hover:bg-gray-300 hover:dark:bg-gray-600">
                                            <img className="col-span-2" src={`${baseProductsURL()}${product.coverImageUrl}`} />
                                            <div className="grid col-span-10 px-1">
                                                <span>{product.name.find(name => name.key == language.code)?.value}</span>
                                                <div className="line-clamp-2 text-gray-400 break-words">
                                                    {product.description.find(desc => desc.key == language.code)?.value}
                                                </div>
                                                <span>{product.price} лв.</span>
                                            </div>
                                            <Separator className="my-2 col-span-12 dark:bg-gray-600" />
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    }
                </div>
            }
        </div>
    )
}