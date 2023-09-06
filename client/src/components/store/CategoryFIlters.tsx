import { useLanguage } from "@/contexts";
import { Filter, Item, sortingParams } from "@/utilities";
import { Dispatch, SetStateAction, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Checkbox } from "../inputs";
import { Separator } from "../ui/separator";

interface Props {
    filters: Item<Item<string, string>[], Filter>[],
    checkedFilters: { key: string, values: string[] }[],
    setCheckedFilters: Dispatch<SetStateAction<{
        key: string;
        values: string[];
    }[]>>
}

export type CategoryFiltersHandle = {
    checkedFilters: { key: string, values: string[] }[]
}

const CategoryFilters = forwardRef<CategoryFiltersHandle, Props>(({ filters, checkedFilters, setCheckedFilters }: Props, ref) => {
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const { language } = useLanguage();

    useImperativeHandle(ref, () => ({
        checkedFilters: checkedFilters
    }))

    function changeFilterState(filterKey: string, filterValuesKey: string, isChecked: boolean) {
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
        var newSearchParams: URLSearchParams = new URLSearchParams();

        var params = Object.fromEntries(searchParams.entries());
        for (var [key, value] of Object.entries(params)) {
            if (sortingParams.includes(key)) {
                newSearchParams.set(key, value);
            }
        }

        checkedFilters.forEach((filter) => {
            var urlParam: string = '';
            filter.values.forEach((value) => {
                if (urlParam == '') {
                    urlParam = value;
                } else {
                    urlParam = urlParam + '|' + value;
                }
            })
            newSearchParams.set(filter.key, urlParam);
        })
        if (isInitialized) {
            navigate(`?${newSearchParams.toString()}`);
        }
    }, [checkedFilters])

    useEffect(() => {
        setIsInitialized(true);
    }, [filters, location.search])

    return (
        <div>
            {filters != undefined &&
                <div className="space-y-2">
                    {filters.map((filter, index) => {
                        return (
                            <div key={index} className="text-black dark:text-white">
                                <h1>{filter.key.find(k => k.key == language.code)?.value}</h1>
                                <div>
                                    {filter.value.values.sort((a, b) => a.key.find(k => k.key == language.code)!.value.localeCompare(b.key.find(k => k.key == language.code)!.value)).map((values, index) => {
                                        return (
                                            <div key={index} className="flex">
                                                <Checkbox checked={checkedFilters.find(cf => cf.key == filter.key.find(k => k.key == language.code)?.value)?.values.includes(values.key.find(k => k.key == language.code)!.value) ?? false}
                                                    id={values.key.find(k => k.key == language.code)!.value}
                                                    onChange={() => changeFilterState(filter.key.find(k => k.key == language.code)!.value, values.key.find(k => k.key == language.code)!.value, !checkedFilters.find(cf => cf.key == filter.key.find(k => k.key == language.code)?.value)?.values.includes(values.key.find(k => k.key == language.code)!.value) ?? false)}
                                                    labelText={`${values.key.find(k => k.key == language.code)!.value} (${values.value.count})`} />
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
})

export default CategoryFilters;