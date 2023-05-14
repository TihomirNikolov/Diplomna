import { FormEvent, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FloatingInput, Spinner, useGetType, useTitle } from "../../components";
import axios from "axios";
import { axiosClient, baseURL, notification, validatePassword } from "../../utilities";
import { useTranslation } from "react-i18next";
import { FloatingInputHandle } from "../../components/inputs/FloatingInput";

export default function ResetPasswordPage() {
    const { t } = useTranslation();
    useTitle(t('title.resetPassword'));

    const { resetToken } = useParams();

    const navigate = useNavigate();

    const passwordInput = useRef<FloatingInputHandle>(null);
    const confirmPasswordInput = useRef<FloatingInputHandle>(null);

    const { isLoading, isSuccess } = useGetType<boolean>(`${baseURL()}api/authenticate/verify-password-token/${resetToken!}`);

    function validatePass(value: string) {
        confirmPasswordInput.current?.showValidation();
        return validatePassword(value);
    }

    function validateConfirmPassword(value: string) {
        return value == passwordInput.current?.value && value != '';
    }

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        confirmPasswordInput.current?.showValidation();

        if (!passwordInput.current?.isValid || !confirmPasswordInput.current?.isValid) {
            passwordInput.current?.showValidation();
            confirmPasswordInput.current?.showValidation();
            return;
        }
        try {
            var response = await axiosClient.post(`${baseURL()}api/authenticate/reset-password`, { resetToken: resetToken, password: passwordInput.current.value });
            navigate('/login');
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                notification.error(t('responseErrors.resetPasswordError'), 'top-center');
            }
        }
    }

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
                <div className="space-y-5 mx-4 w-96">
                    <form className="p-6 space-y-5 bg-white dark:bg-gray-800 rounded-lg shadow-lg" onSubmit={e => onSubmit(e)} noValidate>
                        <h1 className="text-xl font-bold text-black dark:text-gray-500">{t('changePassword')}</h1>
                        <FloatingInput ref={passwordInput}
                            inputId="floating_outlined_1"
                            placeholder={t("password")}
                            type='password' isPassword={true}
                            validate={validatePass} immediateValdation={true}
                            validationMessage={t('passwordInfo')!} />
                        <FloatingInput ref={confirmPasswordInput}
                            inputId="floating_outlined_2"
                            placeholder={t("confirmPassword")}
                            type='password' isPassword={true}
                            validate={validateConfirmPassword} immediateValdation={true}
                            validateOnLostFocus={true}
                            validationMessage={t('errorInput.confirmPasswordInvalid')!} />
                        <div className="space-y-1">
                            <button type="submit" className="text-white bg-blue-600 rounded-lg w-full py-1.5 hover:bg-blue-700" >{t('changePassword')}</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className="grid h-[calc(100vh-50px)] place-items-center">
                <h1 className="text-black dark:text-white">{t('resetPasswordExpired')}</h1>
            </div>
        )
    }
}