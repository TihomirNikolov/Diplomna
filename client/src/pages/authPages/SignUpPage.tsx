import { FormEvent, useEffect, useReducer } from "react";
import { BlueButton, FloatingInput, LinkButton } from "../../components";
import { useTranslation } from "react-i18next";
import {
    RegistrationActionType, IRegistration, registrationReducer,
    RegistrationValidationActionType, IRegistrationValidation, registrationValidationReducer,
    IRegistrationValidationVisible, IRegistrationValidationState, initialState, initialValidationState,
    baseURL, notification, axiosClient,
} from "../../utilities";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const [reducerRegistrationState, dispatchRegistration] = useReducer(registrationReducer, initialState);
    const [reducerRegistrationValidationState, dispatchRegistrationValidation] = useReducer(registrationValidationReducer, initialValidationState)

    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        return () => {
            reducerRegistrationValidationState.validationVisible.isEmailValidVisible = false;
            reducerRegistrationValidationState.validationVisible.isPasswordValidVisible = false;
            reducerRegistrationValidationState.validationVisible.isConfirmPasswordValidVisible = false;
        }
    }, [])

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (reducerRegistrationState.confirmPassword != reducerRegistrationState.registerModel.password || reducerRegistrationState.confirmPassword == "") {
            reducerRegistrationValidationState.validation.isConfirmPasswordValid = false;
            dispatchRegistrationValidation({ type: RegistrationValidationActionType.CONFIRM_PASSWORD_VALIDATION, value: "true" })
        }
        else {
            reducerRegistrationValidationState.validation.isConfirmPasswordValid = true;
            dispatchRegistrationValidation({ type: RegistrationValidationActionType.CONFIRM_PASSWORD_VALIDATION, value: "true" })
        }

        if (!reducerRegistrationValidationState.validation.isEmailValid
            || !reducerRegistrationValidationState.validation.isPasswordValid
            || !reducerRegistrationValidationState.validation.isConfirmPasswordValid) {
            dispatchRegistrationValidation({ type: RegistrationValidationActionType.EMAIL_VALIDATION, value: "true" })
            dispatchRegistrationValidation({ type: RegistrationValidationActionType.PASSWORD_VALIDATION, value: "true" })
            dispatchRegistrationValidation({ type: RegistrationValidationActionType.CONFIRM_PASSWORD_VALIDATION, value: "true" })
            return;
        }

        try {
            await axiosClient.post(`${baseURL()}api/authenticate/register`, reducerRegistrationState.registerModel);
            navigate("/login");
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                notification.error(t('userAlreadyExists'), "top-center");
                console.log(error);
            }
        }
    }

    return (
        <div className="grid h-[calc(100vh-50px)] place-items-center">
            <div className="space-y-5 mx-4 w-96">
                <form className="p-6 space-y-5 bg-white dark:bg-gray-800 rounded-lg shadow-lg" onSubmit={e => onSubmit(e)} noValidate>
                    <h1 className="text-xl font-bold text-black dark:text-gray-500">{t('signUp')}</h1>
                    <FloatingInput inputId="floating_outlined_1" placeholder="E-mail" tabIndex={1} disabled={false} readOnly={false}
                        type="email" value={reducerRegistrationState.registerModel.email}
                        onChange={(e) => dispatchRegistration({ key: "email", type: RegistrationActionType.UPDATE_REGISTER_MODEL, value: e.target.value })}
                        onBlur={(e) => dispatchRegistrationValidation({ type: RegistrationValidationActionType.EMAIL_VALIDATION, value: e.target.value })}
                        isValid={reducerRegistrationValidationState.validation.isEmailValid}
                        isValidVisible={reducerRegistrationValidationState.validationVisible.isEmailValidVisible} />
                    <FloatingInput inputId="floating_outlined_2" placeholder={t("password")} tabIndex={2} disabled={false} readOnly={false}
                        type="password" value={reducerRegistrationState.registerModel.password} isPassword={true}
                        onChange={(e) => dispatchRegistration({ key: "password", type: RegistrationActionType.UPDATE_REGISTER_MODEL, value: e.target.value })}
                        onBlur={(e) => dispatchRegistrationValidation({ type: RegistrationValidationActionType.PASSWORD_VALIDATION, value: e.target.value })}
                        isValid={reducerRegistrationValidationState.validation.isPasswordValid}
                        isValidVisible={reducerRegistrationValidationState.validationVisible.isPasswordValidVisible}
                        tooltip={t("passwordInfo")!} />
                    <FloatingInput inputId="floating_outlined_3" placeholder={t("confirmPassword")} tabIndex={3} disabled={false} readOnly={false}
                        type="password" value={reducerRegistrationState.confirmPassword} isPassword={true}
                        onChange={(e) => dispatchRegistration({ key: "confirmPassword", type: RegistrationActionType.UPDATE, value: e.target.value })}
                        onBlur={(e) => dispatchRegistrationValidation({ type: RegistrationValidationActionType.CONFIRM_PASSWORD_VALIDATION, value: e.target.value })}
                        isValid={reducerRegistrationValidationState.validation.isConfirmPasswordValid}
                        isValidVisible={reducerRegistrationValidationState.validationVisible.isConfirmPasswordValidVisible} />

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