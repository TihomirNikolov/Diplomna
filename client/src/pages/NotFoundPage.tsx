import { useTranslation } from "react-i18next";
import { NotFoundComponent, useTitle } from "../components";

export default function NotFoundPage() {
    const { t } = useTranslation();
    useTitle(t('title.notFound'));

    return (
        <NotFoundComponent />
    )
}