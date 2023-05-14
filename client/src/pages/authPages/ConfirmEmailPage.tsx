import { useParams } from "react-router-dom";
import { baseURL } from "../../utilities";
import { Spinner, useGetType, useTitle } from "../../components";
import { useTranslation } from "react-i18next";

export default function ConfirmEmailPage() {
    const { t } = useTranslation();
    useTitle(t('title.confirmEmail'));

    const { emailConfirmToken } = useParams();

    const { isLoading, isSuccess } = useGetType<boolean>(`${baseURL()}api/user/verify-email/${emailConfirmToken!}`);

    if (isLoading) {
        return (
            <div className="grid h-[calc(100vh-50px)] place-items-center">
                <Spinner />
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className="grid h-[calc(100vh-50px)] place-items-center">
                <h1 className="text-black dark:text-white">{t('suceessfullyConfirmedEmail')}</h1>
            </div>
        )
    }
    else {
        return (
            <div className="grid h-[calc(100vh-50px)] place-items-center">
                <h1 className="text-black dark:text-white">{t('confirmEmailExpired')}</h1>
            </div>
        )
    }
}