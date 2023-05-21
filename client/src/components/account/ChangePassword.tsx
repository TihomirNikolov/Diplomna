import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BlackWhiteButton, FloatingInput, Modal } from "..";
import { useRef, useState } from "react";
import { authClient, baseUserURL, notification, validatePassword } from "../../utilities";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { FloatingInputHandle } from "../inputs/FloatingInput";

interface Props {
    refreshLogins: () => Promise<void>
}

export default function ChangePassword(props: Props) {
    const oldPasswordInput = useRef<FloatingInputHandle>(null);
    const newPasswordInput = useRef<FloatingInputHandle>(null);
    const confirmNewPasswordInput = useRef<FloatingInputHandle>(null);

    const { t } = useTranslation();

    function validateOldPassword(value: string) {
        return value.length >= 8;
    }

    function validatePass(value: string) {
        confirmNewPasswordInput.current?.showValidation();
        return validatePassword(value);
    }

    function validateConfirmPassword(value: string) {

        return value == newPasswordInput.current?.value && value != '';
    }

    async function onSubmit() {
        confirmNewPasswordInput.current?.showValidation();

        if (!oldPasswordInput.current?.isValid || !newPasswordInput.current?.isValid || !confirmNewPasswordInput.current?.isValid) {
            oldPasswordInput.current?.showValidation();
            newPasswordInput.current?.showValidation();
            confirmNewPasswordInput.current?.showValidation();
            return false;
        }

        try {
            var response = await authClient.put(`${baseUserURL()}api/user/change-password`, { oldPassword: oldPasswordInput.current?.value, newPassword: newPasswordInput.current?.value })
            notification.success(t('responseErrors.changePasswordSuccess'), 'top-center');
            props.refreshLogins();
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                notification.error(t('responseErrors.changePasswordError'), 'top-center')
                return false;
            }
        }

        return true;
    }

    return (
        <Modal submit={onSubmit}>
            <Modal.Button>
                <BlackWhiteButton className="w-full"> {t("edit")} <FontAwesomeIcon icon={["fas", "pen-to-square"]} /></BlackWhiteButton>
            </Modal.Button>
            <Modal.Content>
                <form className="space-y-5">
                    <FloatingInput ref={oldPasswordInput}
                        inputId="oldPasswordInput"
                        placeholder={`${t('currentPassword')}`}
                        type="password" isPassword={true}
                        validate={validateOldPassword} immediateValdation={true}
                        validateOnLostFocus={true}
                        validationMessage={t('errorInput.eightCharactersRequired')!}
                    />
                    <FloatingInput ref={newPasswordInput}
                        inputId="newPasswordInput"
                        placeholder={`${t('newPassword')}`}
                        type="password" isPassword={true}
                        validate={validatePass} immediateValdation={true}
                        validateOnLostFocus={true}
                        validationMessage={t('passwordInfo')!}
                    />
                    <FloatingInput ref={confirmNewPasswordInput}
                        inputId="confirmNewPasswordInput"
                        placeholder={`${t('confirmPassword')}`}
                        type="password" isPassword={true}
                        validate={validateConfirmPassword} immediateValdation={true}
                        validateOnLostFocus={true}
                        validationMessage={t("errorInput.confirmPasswordInvalid")!}
                    />
                </form>
            </Modal.Content>
        </Modal>
    )
}