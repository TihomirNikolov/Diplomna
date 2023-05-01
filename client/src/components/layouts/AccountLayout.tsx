import { Link } from "react-router-dom";
import { useUser } from "../../contexts";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export default function AccountLayout(props: any) {
    const { user } = useUser();

    const { t } = useTranslation();

    function isSelected(path: string) {
        if (window.location.pathname === path) {
            return true;
        }
        return false;
    }

    const paths: { path: string, translate: string }[] = [{ path: '/account', translate: 'account' },
    { path: '/account/address', translate: 'myAddresses' },
    { path: '/account/history', translate: 'myHistory' },
    { path: '/wishlist', translate: "wishlist" }];


    return (
        <div className={`grid ${user.isEmailConfirmed ? 'h-[calc(100vh-50px)]' : 'h-[calc(100vh-74px)]'}`}>
            <div className="grid grid-cols-4 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="flex flex-col">
                    <div className="grid grid-cols-2">
                        <div className="flex flex-col col-start-2">
                            {paths.map((item, i) => {
                                return <Link key={i} className={`py-4 border-b-2 ${isSelected(item.path) ? 'text-orange-600 border-b-orange-600' : ''}`}
                                    to={item.path}>{t(item.translate)}</Link>
                            })}
                        </div>
                    </div>
                </div>
                <div className="col-span-3 rounded-lg">
                    {props.children}
                </div>
            </div>
        </div>)
}