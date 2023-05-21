import { Dictionary } from "../../..";

export default interface CoverProduct {
    name: string,
    coverImageUrl: string,
    productUrl: string,
    price: number,
    coverTags: Dictionary<string>,
    addedDate: Date,
    rating: number,
    comments: number,
    soldAmount: number
}