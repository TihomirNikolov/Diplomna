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

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(40);
  const [sorting, setSorting] = useState<SortType>("newest");

  const location = useLocation();

  const sortingRef = useRef<SortingHandle>(null);

  useEffect(() => {
    var urlSearchParams = new URLSearchParams(location.search);
    var params = Object.fromEntries(urlSearchParams.entries());

    var sort: SortType = "newest";
    var itemsPerPage: number = 40;
    var currentPage: number = 1;

    for (var [key, value] of Object.entries(params)) {
      if (key == "sort") {
        sort = value;
        setSorting(value);
      } else if (key == "items") {
        itemsPerPage = parseInt(value);
        setItemsPerPage(parseInt(value));
      } else if (key == "page") {
        currentPage = parseInt(value);
        setCurrentPage(parseInt(value));
      }
    }

    fetchProducts(currentPage, itemsPerPage, sort);
  }, [location.pathname]);

  useEffect(() => {
    fetchProducts(currentPage, itemsPerPage, sorting);
  }, [location.search]);

  async function fetchProducts(
    page: number,
    itemsPerPage: number,
    sorting: SortType,
  ) {
    try {
      setIsLoading(true);
      var response = await axiosClient.post(
        `${baseProductsURL()}api/products/search/getall/${searchText}/${page}/${itemsPerPage}`,
        { sortingType: sorting },
      );
      var products = response.data as CoverProduct[];
      setProducts(products);
    } catch (error) {
      if (axios.isAxiosError(error)) {
      }
    }
    setIsLoading(false);
  }

  function onItemsPerPageChanged(productsPerPage: number) {
    setCurrentPage(1);
  }

  function onSortingTypeChanged(sortingType: SortType) {
    setCurrentPage(1);
  }

  function onPageChanged(page: number) {
    setCurrentPage(page);
    fetchProducts(page, itemsPerPage, sorting);
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
          {t("searchText")} : {searchText}
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
            {products.map((product, index) => {
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
