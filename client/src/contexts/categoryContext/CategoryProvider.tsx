import { useState } from "react";
import { CategoryContext, SortType } from ".";


export default function CategoryProvider(props: any) {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(40);
    const [sorting, setSorting] = useState<SortType>('newest');

    function reset(){
        setCurrentPage(1);
        setItemsPerPage(40);
        setSorting('newest');
    }

    return (
        <CategoryContext.Provider value={{
            currentPage: currentPage, setCurrentPage: setCurrentPage, itemsPerPage: itemsPerPage,
            setItemsPerPage: setItemsPerPage, sorting: sorting, setSorting: setSorting, resetCategory: reset
        }}>
            {props.children}
        </CategoryContext.Provider>
    )
}