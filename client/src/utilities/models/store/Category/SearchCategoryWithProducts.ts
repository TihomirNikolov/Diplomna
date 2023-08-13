import { CoverProduct } from "../Product";
import SearchCategory from "./SearchCategory";

export default interface SearchCategoryWithProducts extends SearchCategory{
    products: CoverProduct[]
}