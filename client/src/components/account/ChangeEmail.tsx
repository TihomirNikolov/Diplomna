import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BlackWhiteButton, FloatingInput, Modal } from "..";
import { Dispatch, useEffect, useState } from "react";
import { UserInfo, authClient, baseURL, notification, validateEmail } from "../../utilities";
import { useTranslation } from "react-i18next";
import axios from "axios";

interface Props {
    userInfo: UserInfo,
    setUserInfo: Dispatch<React.SetStateAction<UserInfo>>,
}

export default function ChangeEmail(props: Props) {
    const [email, setEmail] = useState<string>('');
    const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
    const [isEmailValidationVisible, setIsEmailValidationVisible] = useState<boolean>(false);

    const { t } = useTranslation();

    useEffect(() => {
        setEmail(props.userInfo.email)
    }, [props.userInfo])

    async function onSubmit() {
        if (!validateEmail(email)) {
            setIsEmailValidationVisible(true)
            return false;
        }

        try {
            var response = await authClient.post(`${baseURL()}api/user/request-change-email`, { email: email });

            notification.success(t('changeEmailSuccess'), 'top-center');
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                notification.error(t('changeEmailError'), 'top-center');
            }
            return false;
        }

        return true;
    }

    function onEmailChanged(value: string) {
        setEmail(value);
    }

    function onEmailLostFocus(email: string) {
        if (validateEmail(email)) {
            setIsEmailValid(true);
        } else {
            setIsEmailValid(false);
        }
        setIsEmailValidationVisible(true);
    }

    return (
        <Modal submit={onSubmit}>
            <Modal.Button>
                <BlackWhiteButton> {t("edit")} <FontAwesomeIcon icon={["fas", "pen-to-square"]} /></BlackWhiteButton>
            </Modal.Button>
            <Modal.Content>
                <form>
                    <FloatingInput placeholder="Email" type='email' inputId="emailInput"
                        onChange={(e) => onEmailChanged(e.target.value)} value={email}
                        onBlur={(e) => onEmailLostFocus(e.target.value)}
                        isValid={isEmailValid}
                        isValidVisible={isEmailValidationVisible} />
                </form>
            </Modal.Content>
        </Modal>
    )
}