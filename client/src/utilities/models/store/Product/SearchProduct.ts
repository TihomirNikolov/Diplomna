import { Item } from "@/utilities/types";
import ProductBase from "./ProductBase";

export default interface SearchProduct extends ProductBase{
    description: Item<string, string>[]
}