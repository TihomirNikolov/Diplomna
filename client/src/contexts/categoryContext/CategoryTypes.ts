import { SetStateAction } from "react"

export const sortings = ['lowestPrice', 'highestPrice', 'newest', 'mostSold', 'mostCommented']

export type SortType = typeof sortings[number]

export type CategoryContextType = {
    currentPage: number,
    setCurrentPage: (currentPage: SetStateAction<number>) => void,
    itemsPerPage: number,
    setItemsPerPage: (itemsPerPage: SetStateAction<number>) => void,
    sorting: SortType,
    setSorting: (sorting: SetStateAction<SortType>) => void,
    resetCategory: () => void
}