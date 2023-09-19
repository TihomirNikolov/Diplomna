import { NotFoundComponent, useTitle } from "@/components";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

export default function NewOrderMadePage() {
    const { t } = useTranslation();
    useTitle(t('title.successfulOrder'));

    const location = useLocation();

    const orderId: string = location.state.orderId
    console.log(orderId);
    if (orderId == null || orderId == "") {
        return (
            <NotFoundComponent />
        )
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col text-black dark:text-white font-bold text-2xl">
                <span>
                    {t('successfulOrder')}
                </span>
                <span>
                    {t('withNumber')} {orderId} !
                </span>
                <span>
                    {t('expectDelivery')}
                </span>
                <span>
                    {t('checkStatus')}
                </span>
                <span>
                    {t('yourProfile')}
                </span>
            </div>
        </div>
    )
}