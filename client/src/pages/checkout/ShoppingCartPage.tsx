import { useTranslation } from "react-i18next";
import { useTitle } from "../../components";

export default function ShoppingCartPage() {
    const { t } = useTranslation();
    useTitle(t('title.shoppingCart'));
    
    return (
        <>
        </>
    )
}