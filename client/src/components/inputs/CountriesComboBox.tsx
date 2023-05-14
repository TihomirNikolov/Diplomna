import { Combobox, Transition } from "@headlessui/react";
import { FixedSizeList as List } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment, forwardRef, useImperativeHandle, useState } from "react";
import { FlagIcon, FlagIconCode } from "react-flag-kit";

interface Props {
    labelText: string,
}

type Country = {
    countryCode: FlagIconCode,
    country: string
}

const Countries: Country[] = [
    { country: "Bulgaria", countryCode: 'BG' },
    { country: "USA", countryCode: 'US' }
]

export type CountriesComboboxHandle = {
    selectedCountry: Country
}

const CountriesComboBox = forwardRef<CountriesComboboxHandle, Props>((props: Props, ref) => {
    const [options, setOptions] = useState<Country[]>(Countries);
    const [selected, setSelected] = useState<Country>(Countries[0]);

    const [query, setQuery] = useState('');

    useImperativeHandle(ref, () => ({
        selectedCountry: selected
    }))

    const filteredOptions =
        query === ''
            ? options
            : options.filter((country: Country) =>
                country.country
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(query.toLowerCase().replace(/\s+/g, ''))
            );

    function onSelected(contry: Country) {
        setSelected(contry);
    }

    return (
        <>
            <label>{props.labelText}</label>
            <Combobox>
                <div className="relative mt-1">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg
                                bg-gray-100 dark:bg-gray-600 text-left shadow-lg focus:outline-none sm:text-sm">
                        <Combobox.Button className="w-full">
                            <div className="flex items-center">
                                <div className="ml-2 py-2 truncate flex gap-3 items-center justify-items-center">
                                    <FlagIcon code={selected.countryCode} size={24} />
                                    <span>{selected.country}</span>
                                </div>
                                <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400 mr-1 ml-auto"
                                    aria-hidden="true" />
                            </div>
                        </Combobox.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery('')} >
                        <Combobox.Options className="absolute z-50 mt-1 w-full px-2 overflow-auto rounded-md bg-gray-100 dark:bg-gray-600 py-1 text-base shadow-lg sm:text-sm">
                            <div className="flex flex-col gap-2">
                                <Combobox.Input
                                    className="w-full text-sm bg-transparent rounded-lg text-gray-900 dark:text-white focus:ring-0"
                                    displayValue={(country: Country) => country.country}
                                    onChange={(event) => setQuery(event.target.value)} />
                                <AutoSizer disableHeight>
                                    {({ width }) => (
                                        <List
                                            width={width!}
                                            height={150}
                                            itemCount={filteredOptions.length}
                                            itemSize={30}>
                                            {({ index, style }) => (
                                                <div key={index} style={style}
                                                    className={`text-black dark:text-white cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-500 ${selected == filteredOptions[index] ? 'bg-gray-200 dark:bg-gray-500' : ''}`}
                                                    onClick={() => onSelected(filteredOptions[index])}>
                                                    <div className="ml-2 h-full truncate flex gap-3 items-center justify-items-center">
                                                        <FlagIcon code={filteredOptions[index].countryCode} size={24} />
                                                        <span>{filteredOptions[index].country}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </List>
                                    )}
                                </AutoSizer>
                            </div>
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
        </>
    );
});

export default CountriesComboBox;