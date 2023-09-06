import { Item } from "@/utilities/types";

export default interface Filter {
    values: Item<Item<string,string>[], FilterValue>[]
}

interface FilterValue {
    count: number,
    isChecked: boolean
}
