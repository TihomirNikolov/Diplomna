import { Dictionary } from "@/utilities/types";

export default interface Filter {
    values: Dictionary<FilterValue>
}

interface FilterValue {
    count: number,
    isChecked: boolean
}
