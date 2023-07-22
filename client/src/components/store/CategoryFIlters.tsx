import { CategoryDTO, CoverProduct, Dictionary, Filter, Product } from "@/utilities"
import { ScrollArea } from "../ui/scroll-area"
import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts";
import { Separator } from "../ui/separator";
import { Checkbox } from "../inputs";
import { useNavigate } from "react-router-dom";

interface Props {
    category: CategoryDTO,
    products: CoverProduct[]
}

export default function CategoryFilters({ category, products }: Props) {
    const [filters, setFilters] = useState<Dictionary<Filter>>({});

    const [isInitialized, setIsInitialized] = useState<boolean>();
    const [checkedFilters, setCheckedFilters] = useState<{ key: string, values: string[] }[]>([]);

    const navigate = useNavigate();

    const { language } = useLanguage();

    function changeFilterState(filterKey: string, filterValuesKey: string, isChecked: boolean) {
        setFilters((prevState) => {
            const updatedFilters = { ...prevState };

            const updatedFiltersValues = { ...updatedFilters[filterKey] };

            updatedFiltersValues.values[filterValuesKey].isChecked = isChecked;

            updatedFilters[filterKey] = updatedFiltersValues;

            return updatedFilters
        })

        if (isChecked) {
            setCheckedFilters(prev => {
                var newFilters = [...prev];
                var filterIndex = prev.findIndex(f => f.key == filterKey);
                if (filterIndex == -1) {
                    return [...newFilters, { key: filterKey, values: [filterValuesKey] }];
                }

                newFilters[filterIndex].values.push(filterValuesKey);
                return newFilters;
            });
        }
        else {
            setCheckedFilters(prev => {
                var newFilters = [...prev];

                var filterIndex = prev.findIndex(f => f.key == filterKey);

                if (filterIndex == -1) {
                    return prev;
                }

                newFilters[filterIndex].values = newFilters[filterIndex].values.filter(f => f != filterValuesKey);

                if (newFilters[filterIndex].values.length == 0) {
                    newFilters = newFilters.filter(f => f.key != filterKey);
                }

                return newFilters;
            });
        }
    }

    useEffect(() => {
        var searchParams: URLSearchParams = new URLSearchParams();
        checkedFilters.forEach((filter) => {
            var urlParam: string = '';
            filter.values.forEach((value) => {
                if (urlParam == '') {
                    urlParam = value;
                } else {
                    urlParam = urlParam + '|' + value;
                }
            })
            searchParams.set(filter.key, urlParam);
        })
        if (isInitialized) {
            navigate(`?${searchParams.toString()}`);
        }
    }, [checkedFilters])

    useEffect(() => {
        var categoryTags = category!.tags.find(tag => tag.key == language.code)?.value;

        if (categoryTags == undefined)
            return

        var filters: Dictionary<Filter> = {};

        var urlSearchParams = new URLSearchParams(location.search);
        var params = Object.fromEntries(urlSearchParams.entries());

        var checkedFilters: { key: string, values: string[] }[] = [];
        for (var [key, value] of Object.entries(params)) {
            var values = value.split('|');
            checkedFilters.push({ key: key, values: values });
        }
        setCheckedFilters(checkedFilters);

        for (var product of products) {
            for (var categoryTag of categoryTags) {
                var productTags = product.tags.find(tag => tag.key == language.code)?.value!;
                var tag = productTags.find(tag => tag.key == categoryTag)?.value;
                if (tag != undefined) {
                    if (productTags.find(tag => tag.key == categoryTag)?.value != undefined) {
                        if (filters[categoryTag] == undefined) {
                            filters[categoryTag] = { values: {} };
                        }
                        if (filters[categoryTag].values[tag] == undefined) {
                            filters[categoryTag].values[tag] = { count: 0, isChecked: params[categoryTag] != undefined && params[categoryTag].split('|').includes(tag) };
                            filters[categoryTag].values[tag].count = 1;
                        }
                        else {
                            filters[categoryTag].values[tag].count += 1;
                        }
                    }
                }
            }
        }
        setFilters(filters);
        setIsInitialized(true);
    }, [])

    return (
        <div>
            {filters != undefined &&
                <div className="space-y-2">
                    {Object.entries(filters).map(([key, value]) => {
                        return (
                            <div key={key} className="text-black dark:text-white">
                                <h1>{key}</h1>
                                <div>
                                    {Object.entries(value.values).map(([valueKey, value]) => {
                                        return (
                                            <div key={valueKey} className="flex">
                                                <Checkbox checked={value.isChecked} id={valueKey}
                                                    onChange={() => changeFilterState(key, valueKey, !value.isChecked)}
                                                    labelText={`${valueKey} (${value.count})`} />
                                            </div>
                                        )
                                    })}
                                </div>
                                <Separator className="mt-4" />
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
}