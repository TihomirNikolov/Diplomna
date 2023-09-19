import {
  CoverProductCard,
  Pagination,
  SortingComponent,
  Spinner,
  useTitle,
} from "@/components";
import { SortingHandle } from "@/components/store/SortingComponent";
import {
  CoverProduct,
  SortType,
  axiosClient,
  baseProductsURL,
} from "@/utilities";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function SearchPage() {
  const { t } = useTranslation();
  const { searchText } = useParams();
  useTitle(searchText ?? "");

  const [products, setProducts] = useState<CoverProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showProducts, setShowProducts] = useState<CoverProduct[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(40);
  const [sorting, setSorting] = useState<SortType>("newest");

  const location = useLocation();

  const sortingRef = useRef<SortingHandle>(null);

  useEffect(() => {
    fetchProducts();
  }, [location.pathname]);

  async function fetchProducts() {
    try {
      setIsLoading(true);
      var response = await axiosClient.get(
        `${baseProductsURL()}api/products/search/getall/${searchText}`,
      );
      var products = response.data as CoverProduct[];
      var sortedProducts: CoverProduct[] = sortProducts("newest", products)!;
      setProducts(sortedProducts);
      calculateProductsToShow(sortedProducts, 1, 40);
      setIsLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setIsLoading(false);
      }
    }
  }

  function calculateProductsToShow(
    products: CoverProduct[],
    page: number,
    itemsPerPage: number,
  ) {
    var productsToShow: CoverProduct[];
    productsToShow = products.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage,
    );
    setShowProducts(productsToShow);
  }

  function sortProducts(sortType: SortType, products: CoverProduct[]) {
    switch (sortType) {
      case "lowestPrice":
        var sortedProducts = products.sort((a, b) =>
          a.price < b.price ? -1 : 1,
        );
        setProducts(sortedProducts);
        return sortedProducts;
      case "highestPrice":
        var sortedProducts = products.sort((a, b) =>
          a.price > b.price ? -1 : 1,
        );
        setProducts(sortedProducts);
        return sortedProducts;
      case "newest":
        var sortedProducts = products.sort((a, b) =>
          new Date(a.addedDate).getTime() > new Date(b.addedDate).getTime()
            ? -1
            : 1,
        );
        setProducts(sortedProducts);
        return sortedProducts;
      case "mostCommented":
        var sortedProducts = products.sort((a, b) =>
          a.comments > b.comments ? -1 : 1,
        );
        setProducts(sortedProducts);
        return sortedProducts;
      case "mostSold":
        var sortedProducts = products.sort((a, b) =>
          a.soldAmount > b.soldAmount ? -1 : 1,
        );
        setProducts(sortedProducts);
        return sortedProducts;
    }
  }

  function onItemsPerPageChanged(productsPerPage: number) {
    var currentPageStart = (currentPage - 1) * sortingRef.current!.itemsPerPage;
    var newCurrentPage = Math.ceil((currentPageStart + 1) / productsPerPage);

    setCurrentPage(newCurrentPage);
    calculateProductsToShow(products, newCurrentPage, productsPerPage);
  }

  function onSortingTypeChanged(sortingType: SortType) {
    sortProducts(sortingType, products);
    calculateProductsToShow(
      products,
      currentPage,
      sortingRef.current!.itemsPerPage,
    );
  }

  function onPageChanged(page: number) {
    setCurrentPage(page);
    calculateProductsToShow(products, page, sortingRef.current!.itemsPerPage);
  }

  if (isLoading) {
    return (
      <div className="flex w-full justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-10 col-start-2 md:col-span-9 md:col-start-3 lg:col-span-8 lg:col-start-3">
        <h1 className="flex items-center justify-center py-5 text-4xl font-bold text-black dark:text-white">
            {t('searchText')} : {searchText}
        </h1>
        <div className="flex flex-col gap-5">
          <section className="flex flex-col gap-4 border-b pb-2">
            <div className="flex items-center justify-center gap-4">
              <SortingComponent
                ref={sortingRef}
                onItemsPerPageChanged={onItemsPerPageChanged}
                onSortingTypeChanged={onSortingTypeChanged}
                sorting={sorting}
                setSorting={setSorting}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                disabled={false}
              />
            </div>
            <div className="flex items-center justify-center">
              {sortingRef.current && (
                <Pagination
                  currentPage={currentPage}
                  onPageChanged={onPageChanged}
                  items={products.length}
                  disabled={false}
                />
              )}
            </div>

            <div className="flex items-center justify-start text-black dark:text-white">
              <span>{t("foundResults")}: &nbsp;</span>
              <span>{products.length}</span>
            </div>
          </section>

          <section className="flex flex-wrap justify-center gap-4 md:justify-start">
            {showProducts.map((product, index) => {
              return <CoverProductCard key={index} product={product} />;
            })}
          </section>
          <section className="flex items-center justify-center border-t pt-2">
            <Pagination
              currentPage={currentPage}
              onPageChanged={onPageChanged}
              items={products.length}
              disabled={false}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
