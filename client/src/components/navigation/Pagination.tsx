import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


interface Props {
    onPageChanged: (page: number) => void,
    currentPage: number,
    items: number
}

export default function Pagination(props: Props) {
    const [totalPages, setTotalPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setCurrentPage(props.currentPage == 0 ? 1 : props.currentPage);
        var searchParams: URLSearchParams = new URLSearchParams(location.search);

        searchParams.set('page', props.currentPage == 0 ? '1' : props.currentPage.toString());
        navigate(`?${searchParams.toString()}`);
    }, [props.currentPage])

    useEffect(() => {
        var pages = calculatePages(props.items, getItemsPerPage());
        setTotalPages(pages);
        if (currentPage > pages) {
            setCurrentPage(pages == 0 ? 1 : pages);
            var searchParams: URLSearchParams = new URLSearchParams(location.search);

            searchParams.set('page', pages == 0 ? '1' : pages.toString());
            navigate(`?${searchParams.toString()}`);
        }
    }, [props.items])

    useEffect(() => {
        if (location.search == '') {
            var searchParams: URLSearchParams = new URLSearchParams(location.search);

            searchParams.set('page', '1');
            searchParams.set('items', '40');
            navigate(`?${searchParams.toString()}`);
        }

        var pages = calculatePages(props.items, getItemsPerPage());
        setTotalPages(pages);

    }, [location.search])

    function getItemsPerPage() {
        var urlParams: URLSearchParams = new URLSearchParams(location.search)
        var params = Object.fromEntries(urlParams)
        var items = parseInt(params['items']);
        return items;
    }

    function calculatePages(productsCount: number, itemsPerPage: number) {
        let pagesNumber: number = 1;
        pagesNumber = Math.ceil(productsCount / itemsPerPage);
        return pagesNumber == 0 ? 1 : pagesNumber;
    }

    function renderPages() {
        const pageNumbers: ReactNode[] = [];
        let pagesToRenderBefore: number = 2;
        let pagesToRenderAfter: number = 2;

        if (currentPage + 1 >= totalPages) {
            pagesToRenderBefore += currentPage - totalPages + 2;
        }

        for (var i = pagesToRenderBefore; i >= 1; i--) {
            if (currentPage - i < 1) {
                pagesToRenderAfter++;
            }
            else {
                pageNumbers.push(
                    <li key={currentPage - i}>
                        <button className="h-8 w-10 text-black dark:text-white"
                            onClick={(e) => onPageChanged(parseInt(e.currentTarget.innerText))}>
                            {currentPage - i}
                        </button>
                    </li>
                )
            }
        }

        pageNumbers.push(
            <li key={currentPage}>
                <button className="h-8 w-10 rounded-lg text-black dark:text-white border"
                    onClick={(e) => onPageChanged(parseInt(e.currentTarget.innerText))}>
                    {currentPage}
                </button>
            </li>
        )

        for (var i = 1; i <= pagesToRenderAfter; i++) {
            if (currentPage + i > totalPages) {
                break;
            }
            else {
                pageNumbers.push(
                    <li key={currentPage + i}>
                        <button className="h-8 w-10 text-black dark:text-white"
                            onClick={(e) => onPageChanged(parseInt(e.currentTarget.innerText))}>
                            {currentPage + i}
                        </button>
                    </li>
                )
            }
        }

        return pageNumbers;
    }

    function onPageChanged(page: number) {
        if (page > totalPages || page < 1 || currentPage == page) {
            return;
        }
        setCurrentPage(page);
        props.onPageChanged(page);
    }

    return (
        <ul className="flex gap-1">
            <li>
                <button className="h-8 w-10 border rounded-lg text-black dark:text-white bg-white dark:bg-gray-600"
                    onClick={(e) => onPageChanged(currentPage - 1)}>
                    <FontAwesomeIcon icon={['fas', 'chevron-left']} size="xs" />
                </button>
            </li>
            {renderPages()}
            <li>
                <button className="h-8 w-10 border rounded-lg text-black dark:text-white bg-white dark:bg-gray-600"
                    onClick={(e) => onPageChanged(currentPage + 1)}>
                    <FontAwesomeIcon icon={['fas', 'chevron-right']} size="xs" />
                </button>
            </li>
        </ul>
    )
}
