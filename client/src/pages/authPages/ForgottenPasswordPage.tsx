import { FormEvent, useRef, useState } from "react";
import { FloatingInput, useTitle } from "../../components";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { axiosClient, baseUserURL, notification, validateEmail } from "../../utilities";
import { useNavigate } from "react-router-dom";
import { FloatingInputHandle } from "../../components/inputs/FloatingInput";

export default function ForgottenPasswordPage() {
    const { t } = useTranslation();
    useTitle(t('title.forgottenPassword'));

    const emailInput = useRef<FloatingInputHandle>(null);

    const navigate = useNavigate();

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            var response = await axiosClient.post(`${baseUserURL()}api/authenticate/reset-password-token`, { email: emailInput.current?.value });
            navigate('/login');
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                notification.error(t('responseErrors.resetPasswordEmailError'), 'top-center');
            }
        }
    }

    return (
        <div className="grid h-[calc(100vh-50px)] place-items-center">
            <div className="space-y-5 mx-4 w-96">
                <form className="p-6 space-y-5 bg-white dark:bg-gray-800 rounded-lg shadow-lg" onSubmit={e => onSubmit(e)} noValidate>
                    <h1 className="text-xl font-bold text-black dark:text-gray-500">{t('forgottenPassword')}</h1>
                    <FloatingInput ref={emailInput}
                        inputId="floating_outlined_1"
                        placeholder="E-mail"
                        type="email"
                        validate={validateEmail} immediateValdation={true}
                        validationMessage={t('errorInput.emailInvalid')!} />
                    <div className="space-y-1">
                        <button type="submit" tabIndex={6} className="text-white bg-blue-600 rounded-lg w-full py-1.5 hover:bg-blue-700" >{t('send')}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}