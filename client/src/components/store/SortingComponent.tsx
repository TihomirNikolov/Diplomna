import { SortType, sortings } from "@/utilities"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Listbox, Transition } from "@headlessui/react"
import { Fragment, forwardRef, useState, useImperativeHandle, Dispatch, SetStateAction } from "react"
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface Props {
    onSortingTypeChanged: (sortingType: SortType) => void,
    onItemsPerPageChanged: (productsPerPage: number) => void
}

export type SortingHandle = {
    sorting: SortType,
    setSorting: Dispatch<SetStateAction<string>>,
    itemsPerPage: number,
    setItemsPerPage: Dispatch<SetStateAction<number>>
}

const SortingComponent = forwardRef<SortingHandle, Props>(({ onSortingTypeChanged, onItemsPerPageChanged }: Props, ref) => {
    const { t } = useTranslation();

    const [itemsPerPage, setItemsPerPage] = useState<number>(40);
    const [sorting, setSorting] = useState<SortType>('newest');

    const navigate = useNavigate();

    useImperativeHandle(ref, () => ({
        itemsPerPage: itemsPerPage,
        setItemsPerPage: setItemsPerPage,
        sorting: sorting,
        setSorting: setSorting
    }))

    function changeSorting(sortingType: SortType) {
        setSorting(sortingType);

        var searchParams: URLSearchParams = new URLSearchParams(location.search);

        searchParams.set('sort', sortingType);
        navigate(`?${searchParams.toString()}`);
    }

    function changeItemsPerPage(itemsPerPage: number) {
        setItemsPerPage(itemsPerPage);

        var searchParams: URLSearchParams = new URLSearchParams(location.search);

        searchParams.set('items', itemsPerPage.toString());
        navigate(`?${searchParams.toString()}`);
    }

    return (
        <>
            <div>
                <span className="text-black dark:text-white mr-2 text-sm">{t('sortBy')}:</span>
                <Listbox value={sorting} onChange={onSortingTypeChanged}>
                    {({ open }) => (
                        <div className="relative w-44">
                            <Listbox.Button className="w-full bg-white dark:bg-darkBackground-800
                                                                 text-black dark:text-white border p-1 rounded-lg">
                                <div className="flex w-full items-center justify-between">
                                    <span>{t(`${sorting}`)}</span>
                                    {open == true ?
                                        <FontAwesomeIcon icon={['fas', 'chevron-up']} /> :
                                        <FontAwesomeIcon icon={['fas', 'chevron-down']} />}
                                </div>
                            </Listbox.Button>
                            <Transition
                                show={open}
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1">
                                <Listbox.Options className="absolute z-10 w-full bg-white dark:bg-darkBackground-800 shadow-lg rounded-lg">
                                    {sortings.map((value, index) => {
                                        return (
                                            <Listbox.Option value={value} key={index} className="w-full text-center text-black py-1 dark:text-white
                                                            hover:text-orange-500 hover:dark:text-orange-500 cursor-pointer"
                                                onClick={() => changeSorting(value)}>
                                                {t(`${value}`)}
                                            </Listbox.Option>
                                        )
                                    })}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    )}
                </Listbox>
            </div>

            <div>
                <span className="text-black dark:text-white mr-2 text-sm">{t('showBy')}:</span>
                <Listbox value={itemsPerPage} onChange={onItemsPerPageChanged}>
                    {({ open }) => (
                        <div className="relative w-44">
                            <Listbox.Button className="w-full bg-white dark:bg-darkBackground-800
                                                                     text-black dark:text-white border p-1 rounded-lg">
                                <div className="flex w-full items-center justify-between">
                                    <span></span>
                                    <span>{itemsPerPage}</span>
                                    {open == true ?
                                        <FontAwesomeIcon icon={['fas', 'chevron-up']} /> :
                                        <FontAwesomeIcon icon={['fas', 'chevron-down']} />}
                                </div>
                            </Listbox.Button>
                            <Transition
                                show={open}
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1">
                                <Listbox.Options className="absolute z-10 w-full bg-white dark:bg-darkBackground-800 shadow-lg rounded-lg">
                                    {[20, 40, 60, 80, 100].map((value, index) => {
                                        return (
                                            <Listbox.Option value={value} key={index} className="w-full text-center text-black py-1 dark:text-white
                                                                 hover:text-orange-500 hover:dark:text-orange-500 cursor-pointer"
                                                onClick={() => changeItemsPerPage(value)}>
                                                {value}
                                            </Listbox.Option>
                                        )
                                    })}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    )}
                </Listbox>
            </div>
        </>
    )
})

export default SortingComponent