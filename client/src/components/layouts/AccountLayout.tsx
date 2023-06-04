import { Link } from "react-router-dom";
import { useUser } from "../../contexts";
import { useTranslation } from "react-i18next";
import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AccountLayout(props: any) {
    const { isEmailConfirmed } = useUser();

    const { t } = useTranslation();

    function isSelected(path: string) {
        if (!(window.location.pathname !== '/account' && path === '/account') && window.location.pathname.includes(path)) {
            return true;
        }
        return false;
    }

    const paths: { path: string, translate: string }[] = [{ path: '/account', translate: 'account' },
    { path: '/account/address', translate: 'myAddresses' },
    { path: '/account/history', translate: 'myHistory' },
    { path: '/wishlist', translate: "wishlist" }];


    return (
        <div className="md:grid md:grid-cols-12 text-black dark:text-white rounded-lg">
            <nav className="hidden md:flex flex-col col-span-2 pl-2 pr-4">
                <div className="">
                    <div className="sm:flex flex-col">
                        {paths.map((item, i) => {
                            return <Link key={i} className={`py-4 border-b-2 hover:text-blue-500 hover:border-b-blue-500 ${isSelected(item.path) ? 'text-orange-500 border-b-orange-500' : ''}`}
                                to={item.path}>{t(item.translate)}</Link>
                        })}
                    </div>
                </div>
            </nav>
            <div className="md:hidden">
                <Menu>
                    {({ open }) => (
                        <>
                            <Menu.Button className='px-5 py-2'>
                                <FontAwesomeIcon icon={['fas', 'bars']} />
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

                                <Menu.Items className='absolute bg-lightBackground dark:bg-darkBackground-900
                                                   z-10 mt-2 bottom pl-5
                                                   w-full tranform md:w-2/3 text-black dark:text-white'>
                                    <div className="flex flex-col">
                                        {paths.map((item, i) => {
                                            return (
                                                <Menu.Item key={i}>
                                                    <Link className={`py-4 border-b-2 hover:text-blue-500 hover:border-b-blue-500 ${isSelected(item.path) ? 'text-orange-500 border-b-orange-500' : ''}`}
                                                        to={item.path}>{t(item.translate)}
                                                    </Link>
                                                </Menu.Item>
                                            )
                                        })}
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </>
                    )}
                </Menu>
            </div>
            <div className="md:col-span-8 rounded-lg">
                {props.children}
            </div>
        </div>
    )
}