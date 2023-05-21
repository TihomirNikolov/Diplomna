import { FormEvent, useRef } from "react";
import { BlueButton, FloatingInput, LinkButton, useTitle } from "../../components";
import { useTranslation } from "react-i18next";
import { baseUserURL, notification, axiosClient, validateLastName, validateFirstName, validateEmail, validatePassword } from "../../utilities";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FloatingInputHandle } from "../../components/inputs/FloatingInput";

export default function RegisterPage() {
    const { t } = useTranslation();
    useTitle(t('title.register'));

    const emailInput = useRef<FloatingInputHandle>(null);
    const passwordInput = useRef<FloatingInputHandle>(null);
    const confirmPasswordInput = useRef<FloatingInputHandle>(null);
    const firstNameInput = useRef<FloatingInputHandle>(null);
    const lastNameInput = useRef<FloatingInputHandle>(null);

    const navigate = useNavigate();

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

        if (!emailInput.current?.isValid || !passwordInput.current?.isValid
            || !confirmPasswordInput.current?.isValid || !firstNameInput.current?.isValid
            || !lastNameInput.current?.isValid) {
            emailInput.current?.showValidation();
            passwordInput.current?.showValidation();
            confirmPasswordInput.current?.showValidation();
            firstNameInput.current?.showValidation();
            lastNameInput.current?.showValidation();
            return;
        }
        try {
            await axiosClient.post(`${baseUserURL()}api/authenticate/register`, {
                email: emailInput.current.value, password: passwordInput.current.value,
                firstName: firstNameInput.current.value, lastName: lastNameInput.current.value
            });
            navigate("/login");
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status == 409) {
                    notification.error(t('responseErrors.userAlreadyExists'), "top-center");
                }
                else {
                    notification.error(t('responseErrors.serverError'), 'top-center');
                }
            }
        }
    }

    return (
        <div className="grid h-[calc(100vh-50px)] place-items-center mx-2 sm:mx-0">
            <div className="space-y-5 mx-4 w-full sm:w-96">
                <form className="p-6 space-y-5 bg-white dark:bg-gray-800 rounded-lg shadow-lg" onSubmit={e => onSubmit(e)} noValidate>
                    <h1 className="text-xl font-bold text-black dark:text-gray-500">{t('signUp')}</h1>
                    <FloatingInput ref={emailInput}
                        inputId="floating_outlined_1"
                        placeholder="E-mail"
                        type="email"
                        validate={validateEmail} immediateValdation={true}
                        validationMessage={t('errorInput.emailInvalid')!} />
                    <FloatingInput ref={passwordInput}
                        inputId="floating_outlined_2"
                        placeholder={t("password")}
                        type="password" isPassword={true}
                        validate={validatePass} immediateValdation={true}
                        validationMessage={t('passwordInfo')!} />
                    <FloatingInput ref={confirmPasswordInput}
                        inputId="floating_outlined_3"
                        placeholder={t("confirmPassword")}
                        type="password" isPassword={true}
                        validate={validateConfirmPassword} immediateValdation={true}
                        validateOnLostFocus={true}
                        validationMessage={t("errorInput.confirmPasswordInvalid")!} />
                    <FloatingInput ref={firstNameInput}
                        inputId="floating_outlined_4"
                        placeholder={t('firstName')}
                        type="text"
                        validate={validateFirstName} immediateValdation={true}
                        validationMessage={t('errorInput.threeCharactersRequired')!} />
                    <FloatingInput ref={lastNameInput}
                        inputId="floating_outlined_5"
                        placeholder={t('lastName')}
                        type="text"
                        validate={validateLastName} immediateValdation={true}
                        validationMessage={t('errorInput.threeCharactersRequired')!} />
                    <div className="space-y-1">
                        <BlueButton>{t('signUp')}</BlueButton>
                        <div className="grid place-items-end">
                            <label className="text-sm dark: text-gray-500">{t('alreadyHaveAccount')}<LinkButton link="/login" text={t('logIn')} /></label>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}