import { useTranslation } from "react-i18next";
import { useTitle } from "../../components";

export default function PaymentCardsPage() {
    const { t } = useTranslation();
    useTitle(t('title.paymentCards'));

    return (
        <>
        </>
    )
}