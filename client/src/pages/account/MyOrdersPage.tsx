import { useTranslation } from "react-i18next";
import { useTitle } from "../../components";

export default function MyOrdersPage() {
    const { t } = useTranslation();
    useTitle(t('title.myOrders'));
    
    return (
        <>
        </>
    )
}