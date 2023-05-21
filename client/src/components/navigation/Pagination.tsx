import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useEffect, useState } from "react";


interface Props {
    onPageChanged: (page: number) => void,
    currentPage: number,
    itemsPerPage: number,
    items: number
}

export default function Pagination(props: Props) {
    const [totalPages, setTotalPages] = useState<number>(1);
    const [currentPage, setCurretPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(40);
    const [items, setItems] = useState<number>(0);

    useEffect(() => {
        setCurretPage(props.currentPage);
    }, [props.currentPage])

    useEffect(() => {
        setItemsPerPage(props.itemsPerPage);
        var pages = calculatePages(items, props.itemsPerPage);
        setTotalPages(pages);
    }, [props.itemsPerPage])

    useEffect(() => {
        setItems(props.items);
        var pages = calculatePages(props.items, itemsPerPage);
        setTotalPages(pages);
    }, [props.items])

    function calculatePages(productsCount: number, itemsPerPage: number) {
        let pagesNumber: number = 1;
        pagesNumber = Math.ceil(productsCount / itemsPerPage);
        return pagesNumber;
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
        setCurretPage(page);
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
