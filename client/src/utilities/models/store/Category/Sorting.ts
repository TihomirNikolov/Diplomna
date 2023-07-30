
export const sortings = ['lowestPrice', 'highestPrice', 'newest', 'mostSold', 'mostCommented']

export type SortType = typeof sortings[number]

export const sortingParams = ['sort', 'page', 'items'];
