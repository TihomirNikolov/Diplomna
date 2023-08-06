import { Item } from "../../..";

export default interface CoverProduct {
    id: string,
    name: Item<string, string>[],
    coverImageUrl: string,
    productUrl: string,
    price: number,
    coverTags: Item<string, Item<string, string>[]>[],
    tags: Item<string, Item<string, string>[]>[],
    addedDate: Date,
    rating: number,
    comments: number,
    soldAmount: number
}