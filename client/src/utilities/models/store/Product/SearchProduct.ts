import { Item } from "@/utilities/types";

export default interface SearchProduct{
    name: Item<string, string>[],
    description: Item<string, string>[],
    coverImageUrl: string,
    productUrl: string,
    coverTags: Item<string, Item<string, string>[]>[],
    price: number
}