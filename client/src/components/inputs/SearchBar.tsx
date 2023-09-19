import { useLanguage } from "@/contexts";
import {
  SearchCategory,
  SearchProduct,
  axiosClient,
  baseProductsURL,
} from "@/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Separator } from "../ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { Image } from "../utilities";
import { useTranslation } from "react-i18next";

interface Props {}

export default function SearchBar(props: Props) {
  const { t } = useTranslation();

  const [results, setResults] = useState<SearchProduct[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  const [text, setText] = useState<string>("");

  const [popularProducts, setPopularProducts] = useState<SearchProduct[]>([]);
  const [popularCategories, setPopularCategories] = useState<SearchCategory[]>(
    [],
  );
  const [arePopularVisible, setArePopularVisible] = useState<boolean>(false);

  const navigate = useNavigate();
  const { language } = useLanguage();

  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function fetchPopularProducts() {
    try {
      var result = await axiosClient.get(
        `${baseProductsURL()}api/products/visits/most-popular`,
      );

      var data = result.data as SearchProduct[];
      setPopularProducts(data);
      setArePopularVisible(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
      }
    }
  }

  async function fetchPopularCategories() {
    try {
      var result = await axiosClient.get(
        `${baseProductsURL()}api/categories/visits/most-popular`,
      );

      var data = result.data as SearchCategory[];
      setPopularCategories(data);
      setArePopularVisible(true);
    } catch (error) {
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
    document.addEventListener("mousedown", handleClickOutside, true);

    fetchPopularProducts();
    fetchPopularCategories();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    if (text.length == 0) return;
    const controller = new AbortController();

    async function search() {
      try {
        var result = await axiosClient.get(
          `${baseProductsURL()}api/products/search/${text}`,
          { signal: controller.signal },
        );

        var data = result.data as SearchProduct[];

        setResults(data);
        setArePopularVisible(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
        }
      }
    }
    search();

    return () => {
      controller.abort();
    };
  }, [text]);

  async function onSearchTextChanged(text: string) {
    setText(text);
    if (text.length == 0) {
      setResults([]);
      setArePopularVisible(true);
      return;
    }
  }

  function onKeydown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key == "Enter") {
      if (inputRef.current?.value == "") navigate("/");
      else navigate(`/search/${event.currentTarget.value}`);
      setShowResults(false);
      inputRef?.current?.blur();
    }
  }

  function onClearButtonClicked() {
    inputRef.current!.value = "";
    onSearchTextChanged("");
    inputRef?.current?.focus();
  }

  return (
    <div ref={divRef} className="relative w-full">
      <div className="flex items-center justify-between rounded-lg border">
        <div className="flex w-full items-center">
          <FontAwesomeIcon
            icon={["fas", "search"]}
            className="p-1 text-black dark:text-white"
          />
          <input
            id="search"
            ref={inputRef}
            autoComplete="off"
            value={text}
            className="w-full bg-transparent p-1 text-black outline-none dark:text-white"
            onChange={(e) => onSearchTextChanged(e.target.value)}
            onFocus={() => setShowResults(true)}
            onKeyDown={(e) => onKeydown(e)}
          />
        </div>
        {inputRef.current != null && inputRef.current.value.length > 0 && (
          <FontAwesomeIcon
            icon={["fas", "x"]}
            className="mr-2 cursor-pointer text-black hover:text-red-600
                             dark:text-white dark:hover:text-red-600"
            onClick={() => onClearButtonClicked()}
          />
        )}
      </div>
      {showResults && (
        <div
          className="px-1 absolute z-40 w-full border-b 
                border-l border-r bg-white text-black dark:bg-gray-800 dark:text-white"
        >
          {arePopularVisible && (
            <div>
              <h1 className="px-1 font-bold">{t("mostPopularProducts")}</h1>
              {popularProducts.map((product, index) => {
                return (
                  <Link
                    to={`product/${product.productUrl}`}
                    key={index}
                    onClick={() => setShowResults(false)}
                  >
                    <div className="grid grid-cols-12 place-items-start items-center hover:bg-gray-300 hover:dark:bg-gray-600">
                      <div className="relative col-span-2">
                        <Image
                          src={`${baseProductsURL()}${product.coverImageUrl}`}
                          alt="product"
                        />
                        {product.discount > 0 && (
                          <div className="absolute -left-1 top-3 w-12 -rotate-45 rounded-lg bg-orange-600 text-center">
                            <span>-{product.discount}%</span>
                          </div>
                        )}
                      </div>
                      <div className="col-span-10 grid px-1">
                        <span>
                          {
                            product.name.find(
                              (name) => name.key == language.code,
                            )?.value
                          }
                        </span>
                        <div className="line-clamp-2 break-words text-gray-600 dark:text-gray-400">
                          {
                            product.description.find(
                              (desc) => desc.key == language.code,
                            )?.value
                          }
                        </div>
                        {product.discount > 0 ? (
                          <div className="flex space-x-1">
                            <span className="line-through decoration-red-600 decoration-2">
                              {product.price.toFixed(2)} {t("lv")}
                            </span>
                            <span>
                              {product.discountedPrice.toFixed(2)} {t("lv")}
                            </span>
                          </div>
                        ) : (
                          <>
                            <span>
                              {product.price.toFixed(2)} {t("lv")}
                            </span>
                          </>
                        )}
                      </div>
                      <Separator className="col-span-12 my-2 dark:bg-gray-600" />
                    </div>
                  </Link>
                );
              })}
              <h1 className="px-1 font-bold">{t("mostPopularCategories")}</h1>
              {popularCategories.map((category, index) => {
                return (
                  <div key={index} className="flex">
                    <Link
                      to={`category/${category.urlPath}`}
                      onClick={() => setShowResults(false)}
                      className="w-full px-1 hover:bg-gray-300 hover:dark:bg-gray-600"
                    >
                      {
                        category.displayName.find((c) => c.key == language.code)
                          ?.value
                      }
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
          {results != undefined && results.length > 0 ? (
            <div>
              <h1 className="font-bold">{t("products")}</h1>
              {results.map((product, index) => {
                return (
                  <Link
                    to={`product/${product.productUrl}`}
                    key={index}
                    onClick={() => setShowResults(false)}
                  >
                    <div className="grid grid-cols-12 place-items-start items-center hover:bg-gray-300 hover:dark:bg-gray-600">
                      <div className="relative col-span-2">
                        <Image
                          src={`${baseProductsURL()}${product.coverImageUrl}`}
                          alt="product"
                        />
                        {product.discount > 0 && (
                          <div className="absolute -left-1 top-3 w-12 -rotate-45 rounded-lg bg-orange-600 text-center">
                            <span>-{product.discount}%</span>
                          </div>
                        )}
                      </div>
                      <div className="col-span-10 grid px-1">
                        <span>
                          {
                            product.name.find(
                              (name) => name.key == language.code,
                            )?.value
                          }
                        </span>
                        <div className="line-clamp-2 break-words text-gray-400">
                          {
                            product.description.find(
                              (desc) => desc.key == language.code,
                            )?.value
                          }
                        </div>
                        {product.discount > 0 ? (
                          <div className="flex space-x-1">
                            <span className="line-through decoration-red-600 decoration-2">
                              {product.price.toFixed(2)} {t("lv")}
                            </span>
                            <span>
                              {product.discountedPrice.toFixed(2)} {t("lv")}
                            </span>
                          </div>
                        ) : (
                          <>
                            <span>
                              {product.price.toFixed(2)} {t("lv")}
                            </span>
                          </>
                        )}
                      </div>
                      <Separator className="col-span-12 my-2 dark:bg-gray-600" />
                    </div>
                  </Link>
                );
              })}
              <Link
                to={`/search/${inputRef.current?.value}`}
                className="flex hover:bg-gray-600"
                onClick={() => setShowResults(false)}
              >
                {t("seeAllResults")}
              </Link>
            </div>
          ) : (
            <>{!arePopularVisible && <h1>{t("noResults")}</h1>}</>
          )}
        </div>
      )}
    </div>
  );
}
