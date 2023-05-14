import { Link } from "react-router-dom";
import { useUser } from "../../contexts";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

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
        <div className={`grid ${isEmailConfirmed ? 'min-h-[calc(100vh-50px)]' : 'min-h-[calc(100vh-74px)]'}`}>
            <div className="grid md:grid-cols-5 bg-lightBackground dark:bg-gray-900 text-black dark:text-white rounded-lg md:p-4">
                <button data-collapse-toggle="navbar-default" type="button"
                    className="inline-flex items-center text-gray-500 dark:text-gray-400 rounded-lg md:hidden
                 hover:bg-gray-100 hover:dark:bg-gray-700" aria-controls="navbar-default" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                </button>
                <nav className="hidden md:flex flex-col" id="navbar-default">
                    <div className="grid grid-cols-2">
                        <div className="sm:flex flex-col ml-0 col-start-2">
                            {paths.map((item, i) => {
                                return <Link key={i} className={`py-4 border-b-2 hover:text-blue-500 hover:border-b-blue-500 ${isSelected(item.path) ? 'text-orange-600 border-b-orange-600' : ''}`}
                                    to={item.path}>{t(item.translate)}</Link>
                            })}
                        </div>
                    </div>
                </nav>
                <div className="md:col-span-4 rounded-lg">
                    {props.children}
                </div>
            </div>
        </div>)
}