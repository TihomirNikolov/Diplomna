import { Dictionary } from "../../..";

export default interface Product{
    name: string,
    description: string,
    pictureUrls: string[],
    videoUrls: string[],
    tags: Dictionary<string>
}