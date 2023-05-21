import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BlackWhiteButton, FloatingInput, Modal } from "..";
import { Dispatch, useEffect, useRef, useState } from "react";
import { UserInfo, authClient, baseUserURL, notification, validateEmail } from "../../utilities";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { FloatingInputHandle } from "../inputs/FloatingInput";

interface Props {
    userInfo: UserInfo,
    setUserInfo: Dispatch<React.SetStateAction<UserInfo>>,
}

export default function ChangeEmail(props: Props) {

    const emailInput = useRef<FloatingInputHandle>(null);

    const [initialEmail, setInitialEmail] = useState<string>('');

    const { t } = useTranslation();

    useEffect(() => {
        setInitialEmail(props.userInfo.email)
    }, [props.userInfo])

    async function onSubmit() {
        if (!emailInput.current?.isValid) {
            emailInput.current?.showValidation();
            return false;
        }

        try {
            var response = await authClient.post(`${baseUserURL()}api/user/request-change-email`, { email: emailInput.current?.value });

            notification.success(t('responseErrors.changeEmailSuccess'), 'top-center');
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                notification.error(t('responseErrors.changeEmailError'), 'top-center');
            }
            return false;
        }

        return true;
    }

    return (
        <Modal submit={onSubmit}>
            <Modal.Button>
                <BlackWhiteButton className="w-full"> {t("edit")} <FontAwesomeIcon icon={["fas", "pen-to-square"]} /></BlackWhiteButton>
            </Modal.Button>
            <Modal.Content>
                <form>
                    <FloatingInput ref={emailInput}
                        inputId="emailInput"
                        placeholder="Email"
                        type='email' 
                        initialValue={initialEmail}
                        validate={validateEmail} immediateValdation={true}
                        validateOnLostFocus={true}
                        validationMessage={t('errorInput.emailInvalid')!} />
                </form>
            </Modal.Content>
        </Modal>
    )
}