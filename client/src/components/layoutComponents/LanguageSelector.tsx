import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useLayoutEffect, useState, useRef } from "react"
import { CheckIcon } from '@heroicons/react/20/solid'
import i18n from "../utilities/i18next";
import { classNames } from "../../utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Language {
    name: string,
    code: string,
    icon: string
}

const Languages: Language[] = [
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

const defaultLanguage: Language = {
    name: 'English',
    code: 'en',
    icon: 'uk'
}

export default function LanguageSelector() {
    const [selected, setSelected] = useState<Language>(defaultLanguage);

    useLayoutEffect(() => {
        const lang = localStorage.getItem("i18nextLng");
        if (lang != null) {
            var selectedLang = Languages.filter(e => e.code === lang)[0]
            setSelected(selectedLang);
        }
    }, []);

    return (<Listbox value={selected} onChange={setSelected}>
        {({ open }) => (
            <>
                <div className="relative">
                    <Listbox.Button className="relative rounded-md hover:bg-lightBackground hover:dark:bg-gray-700 px-1.5 text-gray-900 dark:text-white sm:text-sm sm:leading-6">
                        <FontAwesomeIcon icon={["fas", "globe"]} size="lg"/>
                    </Listbox.Button>

                    <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <Listbox.Options className="absolute z-10 mt-1 right-0 max-h-56 overflow-auto rounded-md bg-lightBackground dark:bg-gray-700 py-1 text-base shadow-lg sm:text-sm">
                            {Languages.map((lang) => (
                                <Listbox.Option
                                    key={lang.code}
                                    className={({ active }) =>
                                        classNames(
                                            active ? 'bg-gray-500 dark:bg-lightBackground' : '',
                                            'relative cursor-pointer select-none py-2 pl-3 pr-9'
                                        )
                                    }
                                    value={lang} onClick={() => i18n.changeLanguage(lang.code)}>

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