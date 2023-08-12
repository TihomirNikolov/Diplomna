import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export default function AccountLayout(props: any) {
    const { t } = useTranslation();

    const navigate = useNavigate();
    const location = useLocation();

    const paths: { path: string, translate: string }[] = [{ path: '/account', translate: 'account' },
    { path: '/account/address', translate: 'myAddresses' },
    { path: '/account/history', translate: 'myHistory' },
    { path: '/payments/cards', translate: 'title.paymentCards' },
    { path: '/wishlist', translate: "wishlist" }];

    return (
        <div className="md:grid md:grid-cols-12 text-black dark:text-white rounded-lg">
            <div className="col-start-3 col-span-8">
                <nav className="md:flex flex-col mt-5">
                    <Tabs defaultValue={location.pathname}>
                        <TabsList className="w-full flex h-full flex-wrap">
                            {paths.map((path, index) => {
                                return <TabsTrigger key={index} value={path.path}
                                    className="p-2" onClick={() => navigate(path.path)}>
                                    {t(path.translate)}
                                </TabsTrigger>
                            })}
                        </TabsList>
                    </Tabs>
                </nav>
                <div className="md:col-span-8 rounded-lg">
                    {props.children}
                </div>
            </div>
        </div>
    )
}