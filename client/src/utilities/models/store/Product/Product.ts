import { BaseCategory, Item, ProductReview } from "../../..";
import ProductBase from "./ProductBase";

export default interface Product extends ProductBase{
    description: Item<string, string>[],
    pictureUrls: string[],
    videoUrls: string[],
    reviews: ProductReview[],
    tags: Item<string, Item<string, string>[]>[],
    categories: BaseCategory[]
}