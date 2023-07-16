import { Dictionary } from "@/utilities";
import { BaseCategory } from ".";

export default interface Category extends BaseCategory{
    icon?: string,
    categoryId :string,
    parentCategoryId? : string,
    tags: Dictionary<string[]>
}