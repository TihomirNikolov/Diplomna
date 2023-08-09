import { Item } from "../../..";
import ProductBase from "./ProductBase";

export default interface CoverProduct extends ProductBase{
    tags: Item<string, Item<string, string>[]>[],
    addedDate: Date,
    rating: number,
    comments: number,
    soldAmount: number
}