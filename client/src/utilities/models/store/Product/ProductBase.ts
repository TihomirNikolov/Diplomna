import { Item } from "@/utilities/types";

export default interface ProductBase{
    id: string,
    name: Item<string,string>[],
    productUrl: string,
    coverImageUrl: string,
    price: number,
    storeId: string,
    isAvailable: boolean,
    discount: number,
    discountedPrice: number,
    coverTags: Item<string, Item<string, string>[]>[],
    isNew: boolean
}