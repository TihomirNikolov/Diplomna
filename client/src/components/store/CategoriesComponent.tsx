import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Category, CategoryDTO, axiosClient, baseProductsURL } from "../../utilities";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import { useLanguage } from "../../contexts";

const InitialCategory: CategoryDTO = {
    displayName: {},
    urlPath: '',
    icon: '',
    categoryId: '',
}

export default function CategoriesComponent() {
    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<CategoryDTO>(InitialCategory);

    const { t } = useTranslation();

    const { language } = useLanguage();

    useEffect(() => {
        async function fetchCategories() {
            try {
                var result = await axiosClient.get(`${baseProductsURL()}api/categories/with-subcategories`);
                setCategories(result.data as CategoryDTO[]);
                setSelectedCategory(result.data[0]);
            }
            catch (error) {
                if (axios.isAxiosError(error)) {

                }
                else {
                    console.log(error);
                }
            }
        }

        fetchCategories();
    }, [])

    return (
        <>
            <Menu>
                {({ open }) => (
                    <>
                        <Menu.Button className="bg-transparent md:bg-orange-500 p-2 focus:outline-none w-full font-bold text-lg">
                            <div className="flex gap-1 items-center justify-center">
                                <FontAwesomeIcon icon={['fas', 'bars']} className="text-black dark:text-white md:text-black md:dark:text-black" />
                                <span className="hidden md:block">{t('categories')}</span>
                            </div>
                        </Menu.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1">
                            <Menu.Items className="absolute z-50 mt-2 left-0 md:left-auto
                                                     w-full tranform md:w-2/3 text-black dark:text-white">
                                <div className="hidden
                                                 bg-lightBackground dark:bg-gray-700 
                                                 rounded-lg shadow-lg
                                                 md:grid grid-cols-4">
                                    <div className="py-5">
                                        {categories.map((item, index) => {
                                            return (
                                                <div key={index} className={`cursor-pointer border-r ml-2 py-2
                                                ${selectedCategory == item ? 'border-t border-b border-r-0 border-orange-500 text-orange-500'
                                                        : ''}`}
                                                    onMouseEnter={() => setSelectedCategory(item)}>
                                                    <Menu.Item>
                                                        <Link to={`category/${item.urlPath}`} className="flex gap-1 items-center ">
                                                            <FontAwesomeIcon icon={['fas', item.icon as IconName]} />
                                                            <span>{item.displayName[language.code]}</span>
                                                        </Link>
                                                    </Menu.Item>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className="p-5">
                                        {selectedCategory.subCategories?.map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    <Menu.Item>
                                                        <Link to={`category/${item.urlPath}`}
                                                            className="text-lg font-bold text-orange-500 hover:text-orange-400">{item.displayName[language.code]}</Link>
                                                    </Menu.Item>
                                                    {item.subCategories?.map((subItem, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <Menu.Item>
                                                                    <Link to={`category/${subItem.urlPath}`}
                                                                        className="cursor-pointer hover:text-orange-500">
                                                                        {subItem.displayName[language.code]}
                                                                    </Link>
                                                                </Menu.Item>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="bg-lightBackground dark:bg-gray-700 rounded-lg shadow-lg grid md:hidden">
                                    <div className="p-5">
                                        {categories.map((category, index) => {
                                            return (
                                                <div key={index} className="py-2">
                                                    <Menu.Item>
                                                        <Disclosure>
                                                            {({ open }) => (
                                                                <>
                                                                    <Disclosure.Button className='flex w-full justify-between'>
                                                                        <div className="flex gap-1 items-center">
                                                                            <FontAwesomeIcon icon={['fas', 'book']} />
                                                                            <span>{category.displayName[language.code]}</span>
                                                                        </div>
                                                                        <ChevronDownIcon
                                                                            className={`${open ? 'rotate-180 transform' : ''}
                                                                             h-5 w-5 text-gray-500`} />
                                                                    </Disclosure.Button>
                                                                    <Transition
                                                                        show={open}
                                                                        enter="transition duration-100 ease-out"
                                                                        enterFrom="transform scale-95 opacity-0"
                                                                        enterTo="transform scale-100 opacity-100"
                                                                        leave="transition duration-75 ease-out"
                                                                        leaveFrom="transform scale-100 opacity-100"
                                                                        leaveTo="transform scale-95 opacity-0">
                                                                        <Disclosure.Panel className="ml-5">
                                                                            <Menu.Item>
                                                                                <Link to={`category/${category.urlPath}`}>
                                                                                    {t('viewAll')}
                                                                                </Link>
                                                                            </Menu.Item>
                                                                            {category.subCategories?.map((subCategory, index) => {
                                                                                return (
                                                                                    <div key={index}>
                                                                                        <Disclosure>
                                                                                            {({ open }) => (
                                                                                                <>
                                                                                                    <Disclosure.Button className='flex w-full justify-between'>
                                                                                                        <span>{subCategory.displayName[language.code]}</span>
                                                                                                        <ChevronDownIcon
                                                                                                            className={`${open ? 'rotate-180 transform' : ''}
                                                                                                                                 h-5 w-5 text-gray-500`} />
                                                                                                    </Disclosure.Button>
                                                                                                    <Transition
                                                                                                        show={open}
                                                                                                        enter="transition duration-100 ease-out"
                                                                                                        enterFrom="transform scale-95 opacity-0"
                                                                                                        enterTo="transform scale-100 opacity-100"
                                                                                                        leave="transition duration-75 ease-out"
                                                                                                        leaveFrom="transform scale-100 opacity-100"
                                                                                                        leaveTo="transform scale-95 opacity-0">
                                                                                                        <Disclosure.Panel className="ml-5">
                                                                                                            <Menu.Item>
                                                                                                                <Link to={`category/${subCategory.urlPath}`}>
                                                                                                                    {t('viewAll')}
                                                                                                                </Link>
                                                                                                            </Menu.Item>
                                                                                                            {subCategory.subCategories?.map((subSubCategory, index) => {
                                                                                                                return (
                                                                                                                    <div key={index}>
                                                                                                                        <Menu.Item>
                                                                                                                            <Link to={`category/${subSubCategory.urlPath}`}>
                                                                                                                                {subSubCategory.displayName[language.code]}
                                                                                                                            </Link>
                                                                                                                        </Menu.Item>
                                                                                                                    </div>
                                                                                                                )
                                                                                                            })}
                                                                                                        </Disclosure.Panel>
                                                                                                    </Transition>

                                                                                                </>
                                                                                            )}
                                                                                        </Disclosure>
                                                                                    </div>
                                                                                )
                                                                            })}
                                                                        </Disclosure.Panel>
                                                                    </Transition>
                                                                </>
                                                            )}
                                                        </Disclosure>
                                                    </Menu.Item>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </>
                )}

            </Menu>
        </>
    )
}