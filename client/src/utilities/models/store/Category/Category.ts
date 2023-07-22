import { Item } from "@/utilities";
import { BaseCategory } from ".";

export default interface Category extends BaseCategory{
    icon?: string,
    categoryId :string,
    parentCategoryId? : string,
    tags: Item<string,string[]>[]
}