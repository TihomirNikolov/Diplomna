import { useTranslation } from "react-i18next";
import { AddNewPaymentCard, useTitle } from "../../components";

export default function PaymentCardsPage() {
    const { t } = useTranslation();
    useTitle(t('title.paymentCards'));

    return (
        <div>
            <div className="mx-1 md:ml-0 md:mr-0 mb-2 md:mb-0">
                <h1 className="text-black dark:text-white font-bold text-2xl mb-5">{t('myAddresses')}</h1>
                <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                    <AddNewPaymentCard />
                </div>
            </div>
        </div>
    )
}