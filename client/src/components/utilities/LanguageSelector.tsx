import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useLayoutEffect, useState, useRef } from "react"
import { CheckIcon } from '@heroicons/react/20/solid'
import i18n from "./i18next";
import { classNames } from "../../utilities";

interface ILanguage {
    name: string,
    code: string,
    icon: string
}

const Languages: ILanguage[] = [
    {
        name: 'English',
        code: 'en',
        icon: 'gb'
    },
    {
        name: 'Български',
        code: 'bg',
        icon: 'bg'
    }
]

const defaultLanguage: ILanguage = {
    name: 'English', 
    code: 'en', 
    icon: 'uk'
}

export default function LanguageSelector(props: any) {
    const [selectedLanguage, setSelectedLanguage] = useState<ILanguage>(defaultLanguage);
    const [selected, setSelected] = useState<ILanguage>(defaultLanguage);

    useLayoutEffect(() => {
        const lang = localStorage.getItem("i18nextLng");
        if (lang != null) {
            var selectedLang = Languages.filter(e => e.code === lang)[0]
            setSelectedLanguage(selectedLang)
            setSelected(selectedLang);
        }
    }, []);

    function setLanguage(lang: ILanguage) {
        setSelectedLanguage(lang);
        i18n.changeLanguage(lang.code);
    }

    return (<Listbox value={selected} onChange={setSelected}>
        {({ open }) => (
            <>
                <div className="relative">
                    <Listbox.Button className="relative w-40 rounded-md bg-lightBackground dark:bg-gray-700 py-1.5 pl-3 text-gray-900 dark:text-white sm:text-sm sm:leading-6 shadow-lg">
                        <span className="flex items-center w-full">
                            <span className={`fi fi-${selectedLanguage.icon}`}></span>
                            <span className="ml-3 truncate">{selectedLanguage.name}</span>
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                        </span>
                    </Listbox.Button>

                    <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-lightBackground dark:bg-gray-700 py-1 text-base shadow-lg sm:text-sm">
                            {Languages.map((lang) => (
                                <Listbox.Option
                                    key={lang.code}
                                    className={({ active }) =>
                                        classNames(
                                            active ? 'bg-gray-500 dark:bg-lightBackground' : '',
                                            'relative cursor-pointer select-none py-2 pl-3 pr-9'
                                        )
                                    }
                                    value={lang} onClick={() => setLanguage(lang)}>

                                    {({ selected, active }) => (
                                        <>
                                            <div className="flex items-center">
                                                <span className={`fi fi-${lang.icon}`}></span>
                                                <span className={classNames(selected ? 'font-semibold' : 'font-normal', active ? 'text-white dark:text-gray-900' : 'text-gray-900 dark:text-white',
                                                    'ml-3 block truncate')}>
                                                    {lang.name}
                                                </span>
                                            </div>
                                            {selected ? (
                                                <span className={classNames(
                                                    active ? 'text-white dark:text-gray-900' : 'text-gray-900 dark:text-white',
                                                    'absolute inset-y-0 right-0 flex items-center pr-4'
                                                )}>
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </>
        )}
    </Listbox>
    )
}