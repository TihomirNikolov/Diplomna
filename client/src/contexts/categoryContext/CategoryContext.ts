import { SetStateAction, createContext, useContext } from "react";
import { CategoryContextType, SortType } from ".";

export const CategoryContext = createContext<CategoryContextType>({
    currentPage: 0, setCurrentPage: (currentPage: SetStateAction<number>) => console.log(currentPage),
    itemsPerPage: 0, setItemsPerPage: (itemsPerPage: SetStateAction<number>) => console.log(itemsPerPage),
    sorting: 'newest', setSorting: (sorting: SetStateAction<SortType>) => console.log(sorting),
    resetCategory: () => console.log('')
});

export const useCategory = () => useContext(CategoryContext);
