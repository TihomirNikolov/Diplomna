import { FormEvent, useReducer } from "react";
import { FloatingInput, LinkButton } from "../../components";
import { useTranslation } from "react-i18next";
import {
    RegistrationActionType, IRegistration, registrationReducer,
    RegistrationValidationActionType, IRegistrationValidation, registrationValidationReducer,
    IRegistrationValidationVisible, IRegistrationValidationState
} from "../../utilities/reducers";
import axios from "axios";
import { baseURL } from "../../utilities";
import { toast } from "react-toastify";
import { useTheme } from "../../contexts";
import { useNavigate } from "react-router-dom";


const initialState: IRegistration = {
    confirmPassword: '',
    registerModel: {
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    }
}

const initialValidation: IRegistrationValidation = {
    isEmailValid: false,
    isPasswordValid: false,
    isConfirmPasswordValid: false,
    isFirstNameValid: false,
    isLastNameValid: false
}

const initialValidationVisible: IRegistrationValidationVisible = {
    isEmailValidVisible: false,
    isPasswordValidVisible: false,
    isConfirmPasswordValidVisible: false,
    isFirstNameValidVisible: false,
    isLastNameValidVisible: false
}

const initialValidationState: IRegistrationValidationState = {
    validation: initialValidation,
    validationVisible: initialValidationVisible
}

export default function SignUpPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [reducerRegistrationState, dispatchRegistration] = useReducer(registrationReducer, initialState);
    const [reducerRegistrationValidationState, dispatchRegistrationValidation] = useReducer(registrationValidationReducer, initialValidationState)

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (reducerRegistrationState.confirmPassword != reducerRegistrationState.registerModel.password || reducerRegistrationState.confirmPassword == "") {
            reducerRegistrationValidationState.validation.isConfirmPasswordValid = false;
            dispatchRegistrationValidation({ type: RegistrationValidationActionType.CONFIRM_PASSWORD_VALIDATION, value: "true" })
            return;
        }
        reducerRegistrationValidationState.validation.isConfirmPasswordValid = true;
        dispatchRegistrationValidation({ type: RegistrationValidationActionType.CONFIRM_PASSWORD_VALIDATION, value: "true" })

        if (!reducerRegistrationValidationState.validation.isEmailValid
            || !reducerRegistrationValidationState.validation.isFirstNameValid
            || !reducerRegistrationValidationState.validation.isPasswordValid
            || !reducerRegistrationValidationState.validation.isFirstNameValid
            || !reducerRegistrationValidationState.validation.isLastNameValid) {
            dispatchRegistrationValidation({ type: RegistrationValidationActionType.EMAIL_VALIDATION, value: "true" })
            dispatchRegistrationValidation({ type: RegistrationValidationActionType.PASSWORD_VALIDATION, value: "true" })
            dispatchRegistrationValidation({ type: RegistrationValidationActionType.CONFIRM_PASSWORD_VALIDATION, value: "true" })
            dispatchRegistrationValidation({ type: RegistrationValidationActionType.FIRST_NAME_VALIDATION, value: "true" })
            dispatchRegistrationValidation({ type: RegistrationValidationActionType.LAST_NAME_VALIDATION, value: "true" })
            return;
        }

        try {
            var response = await axios.post(`${baseURL()}api/authenticate/register`, reducerRegistrationState.registerModel)
            navigate("/login");
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error("User already exists.", {
                    position: "top-center",
                    theme: theme
                });
            }
        }
    }

    return (
        <div className="grid h-[calc(100vh-76px)] place-items-center">
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
                        isValidVisible={reducerRegistrationValidationState.validationVisible.isPasswordValidVisible} />
                    <FloatingInput inputId="floating_outlined_3" placeholder={t("confirmPassword")} tabIndex={3} disabled={false} readOnly={false}
                        type="password" value={reducerRegistrationState.confirmPassword} isPassword={true}
                        onChange={(e) => dispatchRegistration({ key: "confirmPassword", type: RegistrationActionType.UPDATE, value: e.target.value })}
                        onBlur={(e) => dispatchRegistrationValidation({ type: RegistrationValidationActionType.CONFIRM_PASSWORD_VALIDATION, value: e.target.value })}
                        isValid={reducerRegistrationValidationState.validation.isConfirmPasswordValid}
                        isValidVisible={reducerRegistrationValidationState.validationVisible.isConfirmPasswordValidVisible} />
                    <FloatingInput inputId="floating_outlined_4" placeholder={t("firstName")} tabIndex={4} disabled={false} readOnly={false}
                        type="text" value={reducerRegistrationState.registerModel.firstName}
                        onChange={(e) => dispatchRegistration({ key: "firstName", type: RegistrationActionType.UPDATE_REGISTER_MODEL, value: e.target.value })}
                        onBlur={(e) => dispatchRegistrationValidation({ type: RegistrationValidationActionType.FIRST_NAME_VALIDATION, value: e.target.value })}
                        isValid={reducerRegistrationValidationState.validation.isFirstNameValid}
                        isValidVisible={reducerRegistrationValidationState.validationVisible.isFirstNameValidVisible} />
                    <FloatingInput inputId="floating_outlined_5" placeholder={t("lastName")} tabIndex={5} disabled={false} readOnly={false}
                        type="text" value={reducerRegistrationState.registerModel.lastName}
                        onChange={(e) => dispatchRegistration({ key: "lastName", type: RegistrationActionType.UPDATE_REGISTER_MODEL, value: e.target.value })}
                        onBlur={(e) => dispatchRegistrationValidation({ type: RegistrationValidationActionType.LAST_NAME_VALIDATION, value: e.target.value })}
                        isValid={reducerRegistrationValidationState.validation.isLastNameValid}
                        isValidVisible={reducerRegistrationValidationState.validationVisible.isLastNameValidVisible} />

                    <div className="space-y-1">
                        <button type="submit" tabIndex={6} className="text-white bg-blue-600 rounded-lg w-full py-1.5 hover:bg-blue-700" >{t('signUp')}</button>
                        <div className="grid place-items-end">
                            <label className="text-sm dark: text-gray-500">{t('alreadyHaveAccount')}<LinkButton link="/login" text={t('logIn')} /></label>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}