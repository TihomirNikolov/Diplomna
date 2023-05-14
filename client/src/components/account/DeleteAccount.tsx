import { useTranslation } from "react-i18next";
import { FloatingInput, Input } from "../inputs";
import { Modal } from "../modals";
import { useRef } from "react";
import { FloatingInputHandle } from "../inputs/FloatingInput";
import { authClient, baseURL, notification, validateEmail } from "../../utilities";
import axios from "axios";
import { useUser } from "../../contexts";



export default function DeleteAccount() {
    const { t } = useTranslation();

    const { logout } = useUser();

    const emailInput = useRef<FloatingInputHandle>(null)
    const passwordInput = useRef<FloatingInputHandle>(null)

    function validatePassword(value: string) {
        return value.length >= 8;
    }

    async function onDeleteAccount() {
        if (!emailInput.current?.isValid || !passwordInput.current?.isValid) {
            emailInput.current?.showValidation();
            passwordInput.current?.showValidation();
            return false;
        }

        try {
            var response = await authClient.post(`${baseURL()}api/user/delete`, { email: emailInput.current.value, password: passwordInput.current.value });
            logout();
            return true;
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status == 403) {
                    notification.error(t('responseErrors.loginError'), 'top-center');
                }else{
                    notification.error(t('responseErrors.serverError'), 'top-center');
                }
            }
            return false;
        }
    }

    return (
        <Modal submit={onDeleteAccount}>
            <Modal.Button>
                <button className="text-red-600 dark:bg-gray-800 rounded-lg p-2
                                 border-gray-300 dark:border-gray-800 border-2 shadow-lg
                                 hover:bg-red-600 hover:dark:bg-red-600 hover:border-red-600 
                                 hover:dark:border-red-600 hover:text-white w-full">
                    {t('deleteYourAccount')}
                </button>
            </Modal.Button>
            <Modal.Content>
                <form className="flex flex-col gap-3">
                    <FloatingInput ref={emailInput}
                        inputId="emailInput"
                        placeholder={t('yourEmail')}
                        type="email"
                        validate={validateEmail} immediateValdation={true}
                        validateOnLostFocus={true}
                        validationMessage={t('errorInput.emailInvalid')!} />
                    <FloatingInput ref={passwordInput}
                        inputId="passwordEmail"
                        placeholder={t('confirmYourPassword')}
                        type="password" isPassword={true}
                        validate={validatePassword} immediateValdation={true}
                        validationMessage={t('errorInput.eightCharactersRequired')!} />
                </form>
            </Modal.Content>
        </Modal>
    )
}