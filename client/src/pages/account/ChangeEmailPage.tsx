import { useNavigate, useParams } from "react-router-dom";
import { Spinner, useTitle } from "../../components";
import { axiosClient, baseUserURL } from "../../utilities";
import { useEffect, useState } from "react";
import { useUser } from "../../contexts";
import { useTranslation } from "react-i18next";

export default function ChangeEmailPage() {
    const { t } = useTranslation();
    useTitle(t('title.changeEmail'));

    const { emailChangeToken } = useParams();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSuccess, setIsSuccess] = useState<boolean>();

    const { logout } = useUser();

    const navigate = useNavigate();

    useEffect(() => {
        async function fetch() {
            try {
                setIsLoading(true);
                var response = await axiosClient.put(`${baseUserURL()}api/user/change-email/${emailChangeToken!}`);
                setIsSuccess(true);
                await logout();
                navigate('');
            }
            catch (error) {
                setIsSuccess(false);
            }
            finally {
                setIsLoading(false);
            }
        }

        fetch();
    }, []);

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
                <h1 className="text-black dark:text-white">{t('successfullyChangedEmail')}</h1>
            </div>
        )
    }
    else {
        return (
            <div className="grid h-[calc(100vh-50px)] place-items-center">
                <h1 className="text-black dark:text-white">{t('changeEmailExpired')}</h1>
            </div>
        )
    }
}