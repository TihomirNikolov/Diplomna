import { Combobox, Transition } from "@headlessui/react";
import { FixedSizeList as List } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";

interface Props {
    options: any[],
}

export default function ComboBox(props: Props) {
    const [options, setOptions] = useState<string[]>([]);
    const [selected, setSelected] = useState<string>('');

    const [query, setQuery] = useState('');

    const filteredOptions =
        query === ''
            ? options
            : options.filter((region: string) =>
                region
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(query.toLowerCase().replace(/\s+/g, ''))
            );

    function onSelected(value: string) {
        setSelected(value);
    }

    return (
        <>
            <label>Combobox</label>
            <Combobox>
                <div className="relative mt-1">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg
                                 bg-white text-left shadow-md focus:outline-none sm:text-sm">
                        <Combobox.Input
                            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                            displayValue={(region: string) => region}
                            onChange={(event) => setQuery(event.target.value)} />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true" />
                        </Combobox.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery('')} >
                        <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg sm:text-sm">
                            <AutoSizer disableHeight>
                                {({ width }) => (
                                    <List
                                        width={width!}
                                        height={150}
                                        itemCount={filteredOptions.length}
                                        itemSize={30}>
                                        {({ index, style }) => (
                                            <div key={index} style={style}
                                                className={`text-black cursor-pointer hover:bg-gray-200 ${selected == filteredOptions[index] ? 'bg-gray-200' : ''}`}
                                                onClick={() => onSelected(filteredOptions[index])}>
                                                <div className="ml-2 truncate">
                                                    {filteredOptions[index]}
                                                </div>
                                            </div>
                                        )}
                                    </List>
                                )}
                            </AutoSizer>
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
        </>
    )
}