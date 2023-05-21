import { Category } from ".";

export default interface CategoryDTO extends Category{
    subCategories?: CategoryDTO[]
}