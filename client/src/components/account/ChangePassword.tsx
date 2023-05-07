import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BlackWhiteButton, FloatingInput, Modal } from "..";
import { useState } from "react";
import { authClient, baseURL, notification, validatePassword } from "../../utilities";
import { useTranslation } from "react-i18next";
import axios from "axios";

interface Props{
    refreshLogins: () => Promise<void>
}

export default function ChangePassword(props: Props) {
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');

    const [isOldPasswordValid, setIsOldPasswordValid] = useState<boolean>(false);
    const [isNewPasswordValid, setIsNewPasswordValid] = useState<boolean>(false);
    const [isConfirmNewPasswordValid, setIsConfirmNewPasswordValid] = useState<boolean>(false);

    const [isOldPasswordValidationVisible, setIsOldPasswordValidationVisible] = useState<boolean>(false);
    const [isNewPasswordValidationVisible, setIsNewPasswordValidationVisible] = useState<boolean>(false);
    const [isConfirmNewPasswordValidationVisible, setIsConfirmNewPasswordValidationVisible] = useState<boolean>(false);

    const { t } = useTranslation();

    async function onSubmit() {
        if (confirmNewPassword != newPassword) {
            setIsConfirmNewPasswordValid(false);
            setIsConfirmNewPasswordValidationVisible(true);
            return false;
        }

        if (!validatePassword(oldPassword) || !validatePassword(newPassword) || confirmNewPassword != newPassword) {
            setIsOldPasswordValidationVisible(true);
            setIsNewPasswordValidationVisible(true);
            setIsConfirmNewPasswordValidationVisible(true);
            return false;
        }

        try {
            var response = await authClient.put(`${baseURL()}api/user/change-password`, {oldPassword: oldPassword, newPassword: newPassword})
            notification.success(t('changePasswordSuccess'), 'top-center');
            props.refreshLogins();
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                notification.error(t('changePasswordError'), 'top-center')
                return false;
            }
        }

        return true;
    }

    function onOldPasswordChanged(value: string) {
        setOldPassword(value);
    }

    function onNewPasswordChanged(value: string) {
        setNewPassword(value);
    }

    function onConfirmNewPasswordChanged(value: string) {
        setConfirmNewPassword(value);
    }

    function onOldPasswordLostFocus(oldPassword: string) {
        if (validatePassword(oldPassword)) {
            setIsOldPasswordValid(true);
        } else {
            setIsOldPasswordValid(false);
        }
        setIsOldPasswordValidationVisible(true);
    }

    function onNewPasswordLostFocus(newPassword: string) {
        if (validatePassword(newPassword)) {
            setIsNewPasswordValid(true);
        } else {
            setIsNewPasswordValid(false);
        }
        setIsNewPasswordValidationVisible(true);
    }

    return (
        <Modal submit={onSubmit}>
            <Modal.Button>
                <BlackWhiteButton> {t("edit")} <FontAwesomeIcon icon={["fas", "pen-to-square"]} /></BlackWhiteButton>
            </Modal.Button>
            <Modal.Content>
                <form className="space-y-5">
                    <FloatingInput placeholder={`${t('currentPassword')}`} type='password' inputId="oldPasswordInput"
                        onChange={(e) => onOldPasswordChanged(e.target.value)} value={oldPassword}
                        onBlur={(e) => onOldPasswordLostFocus(e.target.value)}
                        isValid={isOldPasswordValid} isPassword={true}
                        isValidVisible={isOldPasswordValidationVisible} />
                    <FloatingInput placeholder={`${t('newPassword')}`} type='password' inputId="newPasswordInput"
                        onChange={(e) => onNewPasswordChanged(e.target.value)} value={newPassword}
                        onBlur={(e) => onNewPasswordLostFocus(e.target.value)}
                        isValid={isNewPasswordValid} isPassword={true}
                        isValidVisible={isNewPasswordValidationVisible}
                        tooltip={t("passwordInfo")!} />
                    <FloatingInput placeholder={`${t('confirmPassword')}`} type='password' inputId="confirmNewPasswordInput"
                        onChange={(e) => onConfirmNewPasswordChanged(e.target.value)} value={confirmNewPassword}
                        isValid={isConfirmNewPasswordValid} isPassword={true}
                        isValidVisible={isConfirmNewPasswordValidationVisible} />
                </form>
            </Modal.Content>
        </Modal>
    )
}