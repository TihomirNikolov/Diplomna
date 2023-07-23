import { Item } from "@/utilities/types";

export default interface SearchCategory{
    displayName: Item<string, string>[],
    urlPath: string,
}