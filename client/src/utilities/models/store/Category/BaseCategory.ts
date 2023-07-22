import { Dictionary, Item } from "../../..";

export default interface BaseCategory {
    displayName: Item<string, string>[],
    urlPath: string,
}