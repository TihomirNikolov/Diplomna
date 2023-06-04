import { BaseCategory, Dictionary, ProductReview } from "../../..";

export default interface Product{
    name: Dictionary<string>,
    description: Dictionary<string>,
    pictureUrls: string[],
    coverImageUrl: string,
    productUrl: string,
    price: number,
    videoUrls: string[],
    reviews: ProductReview[],
    tags: Dictionary<string>,
    coverTags: Dictionary<Dictionary<string>>,
    categories: BaseCategory[]
}