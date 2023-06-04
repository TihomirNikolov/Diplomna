import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function NotFoundComponent() {
    const { t } = useTranslation();

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col text-black dark:text-white text-2xl items-center">
                <h1>{t('sorry').toUpperCase()}</h1>
                <h2>{t('notFoundPage')}</h2>
                <Link to="/" className="text-blue-600 dark:text-blue-600 hover:text-blue-500 hover:dark:text-blue-500">{t('goToHome')}</Link>
            </div>
        </div>
    )
}