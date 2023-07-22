import { BaseCategory, Item, ProductReview } from "../../..";

export default interface Product{
    name: Item<string, string>[],
    description: Item<string, string>[],
    pictureUrls: string[],
    coverImageUrl: string,
    productUrl: string,
    price: number,
    videoUrls: string[],
    reviews: ProductReview[],
    tags: Item<string, Item<string, string>[]>[],
    coverTags: Item<string, Item<string, string>[]>[],
    categories: BaseCategory[]
}