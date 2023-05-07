import { FormEvent, useState } from "react";
import { FloatingInput } from "../../components";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { axiosClient, baseURL, notification, validateEmail } from "../../utilities";
import { useNavigate } from "react-router-dom";

export default function ForgottenPasswordPage() {
    const [email, setEmail] = useState<string>('');
    const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
    const [isEmailValidationVisible, setIsEmailValidationVisible] = useState<boolean>(false);

    const { t } = useTranslation();
    const navigate = useNavigate();
    
    function onEmailChanged(value: string) {
        setEmail(value);
    }

    function onEmailLostFocus(email: string) {
        if (validateEmail(email)) {
            setIsEmailValid(true);
        } else {
            setIsEmailValid(false);
        }
        setIsEmailValidationVisible(true);
    }

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            var response = await axiosClient.post(`${baseURL()}api/authenticate/reset-password-token`, {email: email});
            navigate('/login');
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                notification.error(t('resetPasswordEmailError'), 'top-center');
            }
        }
    }

    return (
        <div className="grid h-[calc(100vh-50px)] place-items-center">
            <div className="space-y-5 mx-4 w-96">
                <form className="p-6 space-y-5 bg-white dark:bg-gray-800 rounded-lg shadow-lg" onSubmit={e => onSubmit(e)} noValidate>
                    <h1 className="text-xl font-bold text-black dark:text-gray-500">{t('forgottenPassword')}</h1>
                    <FloatingInput inputId="floating_outlined_1" placeholder="E-mail" tabIndex={1} disabled={false}
                        readOnly={false} type="text" value={email}
                        onChange={(e) => onEmailChanged(e.target.value)}
                        onBlur={(e) => onEmailLostFocus(e.target.value)}
                        isValid={isEmailValid}
                        isValidVisible={isEmailValidationVisible} />
                    <div className="space-y-1">
                        <button type="submit" tabIndex={6} className="text-white bg-blue-600 rounded-lg w-full py-1.5 hover:bg-blue-700" >{t('send')}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}