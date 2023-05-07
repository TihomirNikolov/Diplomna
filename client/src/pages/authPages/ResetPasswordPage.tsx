import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FloatingInput, Spinner, i18n, useGetType } from "../../components";
import axios from "axios";
import { axiosClient, baseURL, notification, validatePassword } from "../../utilities";
import { useTranslation } from "react-i18next";

export default function ResetPasswordPage() {
    const { resetToken } = useParams();

    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
    const [isPasswordValidationVisible, setIsPasswordValidationVisible] = useState<boolean>(false);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState<boolean>(false);
    const [isConfirmPasswodValidationVisble, setIsConfirmPasswordValidationVisible] = useState<boolean>(false);

    const { t } = useTranslation();
    const navigate = useNavigate();

    const { isLoading, isSuccess } = useGetType<boolean>(`${baseURL()}api/authenticate/verify-password-token/${resetToken!}`);

    function onPasswordChanged(value: string) {
        setPassword(value);
    }

    function onPasswordLostFocus(password: string) {
        if (validatePassword(password)) {
            setIsPasswordValid(true);
        } else {
            setIsPasswordValid(false);
        }
        setIsPasswordValidationVisible(true);
    }

    function onConfirmPasswordChanged(value: string) {
        setConfirmPassword(value);
    }

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (confirmPassword != password || confirmPassword == '' || !validatePassword(password)) {
            setIsConfirmPasswordValid(false);
            setIsConfirmPasswordValidationVisible(true);
        }
        else {
            setIsConfirmPasswordValid(true);
            setIsConfirmPasswordValidationVisible(true);
        }

        if (!validatePassword(password) || confirmPassword != password || confirmPassword == '') {
            setIsPasswordValidationVisible(true);
            return;
        }
        try {
            var response = await axiosClient.post(`${baseURL()}api/authenticate/reset-password`, { resetToken: resetToken, password: password });
            navigate('/login');
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                notification.error(t('resetPasswordError'), 'top-center');
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
                        <FloatingInput inputId="floating_outlined_2" placeholder={t("password")} tabIndex={2} disabled={false} readOnly={false}
                            type="password" value={password} isPassword={true}
                            onChange={(e) => onPasswordChanged(e.target.value)}
                            onBlur={(e) => onPasswordLostFocus(e.target.value)}
                            isValid={isPasswordValid}
                            isValidVisible={isPasswordValidationVisible}
                            tooltip={t("passwordInfo")!} />
                        <FloatingInput inputId="floating_outlined_3" placeholder={t("confirmPassword")} tabIndex={3} disabled={false} readOnly={false}
                            type="password" value={confirmPassword} isPassword={true}
                            onChange={(e) => onConfirmPasswordChanged(e.target.value)}
                            isValid={isConfirmPasswordValid}
                            isValidVisible={isConfirmPasswodValidationVisble} />
                        <div className="space-y-1">
                            <button type="submit" tabIndex={6} className="text-white bg-blue-600 rounded-lg w-full py-1.5 hover:bg-blue-700" >{t('changePassword')}</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className="grid h-[calc(100vh-50px)] place-items-center">
                <h1 className="text-black dark:text-white">PASASWORD RESET TOKEN HAS EXPIRED OR IT ISNT VALID</h1>
            </div>
        )
    }
}