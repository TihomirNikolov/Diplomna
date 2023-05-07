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
        <div className={`grid ${isEmailConfirmed ? 'h-[calc(100vh-50px)]' : 'h-[calc(100vh-74px)]'}`}>
            <div className="grid grid-cols-5 bg-lightBackground dark:bg-gray-900 text-black dark:text-white rounded-lg md:p-4">
                <nav className="flex flex-col">
                    <div className="grid grid-cols-2">
                        <div className="flex flex-col ml-2 md:ml-0 md:col-start-2">
                            {paths.map((item, i) => {
                                return <Link key={i} className={`py-4 border-b-2 hover:text-blue-500 hover:border-b-blue-500 ${isSelected(item.path) ? 'text-orange-600 border-b-orange-600' : ''}`}
                                    to={item.path}>{t(item.translate)}</Link>
                            })}
                        </div>
                    </div>
                </nav>
                <div className="col-span-4 rounded-lg">
                    {props.children}
                </div>
            </div>
        </div>)
}