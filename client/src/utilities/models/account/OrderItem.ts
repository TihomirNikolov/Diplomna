import { Item } from "@/utilities/types"

export interface OrderItem {
    productId: string,
    count: string,
    sum: string,
    storeId: string
}

export interface FullOrderItem {
    productId: string,
    count: string,
    sum: string,
    name: Item<string,string>[],
    productUrl: string,
    imageUrl: string
}