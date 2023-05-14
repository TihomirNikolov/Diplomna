import { useTranslation } from "react-i18next";
import { useTitle } from "../../components";

export default function WishlistPage() {
    const { t } = useTranslation();
    useTitle(t('title.wishlist'));
    
    return (
        <>
        </>
    )
}