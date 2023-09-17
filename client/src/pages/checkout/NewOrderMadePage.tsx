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
                    Успешно направихте поръчката си
                </span>
                <span>
                    с № {orderId} !
                </span>
                <span>
                    Очаквайте доставка до няколко дни!
                </span>
                <span>
                    Може да проверите статуса на поръчката Ви
                </span>
                <span>
                    във вашият профил!
                </span>
            </div>
        </div>
    )
}