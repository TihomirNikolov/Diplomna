import { Dictionary } from "../../..";

export default interface CoverProduct {
    name: Dictionary<string>,
    coverImageUrl: string,
    productUrl: string,
    price: number,
    coverTags: Dictionary<Dictionary<string>>,
    tags: Dictionary<Dictionary<string>>,
    addedDate: Date,
    rating: number,
    comments: number,
    soldAmount: number
}