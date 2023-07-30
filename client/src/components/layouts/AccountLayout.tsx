import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export default function AccountLayout(props: any) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    function isSelected(path: string) {
        if (!(window.location.pathname !== '/account' && path === '/account') && window.location.pathname.includes(path)) {
            return true;
        }
        return false;
    }

    const paths: { path: string, translate: string }[] = [{ path: '/account', translate: 'account' },
    { path: '/account/address', translate: 'myAddresses' },
    { path: '/account/history', translate: 'myHistory' },
    { path: '/payments/cards', translate: 'title.paymentCards'},
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
                <Tabs defaultValue="/account">
                    <TabsList className="w-full flex h-full flex-wrap">
                        {paths.map((path, index) => {
                            return <TabsTrigger key={index} value={path.path}
                                className="p-2" onClick={() => navigate(path.path)}>
                                {t(path.translate)}
                            </TabsTrigger>
                        })}
                    </TabsList>
                </Tabs>
            </div>
            <div className="md:col-span-8 rounded-lg">
                {props.children}
            </div>
        </div>
    )
}