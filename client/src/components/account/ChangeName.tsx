import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BlackWhiteButton, FloatingInput, Modal } from "..";
import { Dispatch, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UserInfo, authClient, baseURL, notification } from "../../utilities";
import axios from "axios";

interface Props {
    userInfo: UserInfo,
    setUserInfo: Dispatch<React.SetStateAction<UserInfo>>,
}

export default function ChangeName(props: Props) {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [isFirstNameValid, setIsFirstNameValid] = useState<boolean>(false);
    const [isLastNameValid, setIsLastNameValid] = useState<boolean>(false);
    const [isFirstNameValidationVisible, setIsFirstNameValidationVisible] = useState<boolean>(false);
    const [isLastNameValidationVisible, setIsLastNameValidationVisible] = useState<boolean>(false);

    const { t } = useTranslation();

    useEffect(() => {
        setFirstName(props.userInfo.firstName);
        setLastName(props.userInfo.lastName)
    }, [props.userInfo])

    async function onSubmit() {
        if (firstName.length < 1 || lastName.length < 1) {
            setIsFirstNameValidationVisible(true);
            setIsLastNameValidationVisible(true);
            return false;
        }
        try {
            var response = await authClient.put(`${baseURL()}api/user/change-name`, { firstName: firstName, lastName: lastName });
            props.setUserInfo((prev: UserInfo) => {
                return{
                    ...prev,
                    firstName: firstName,
                    lastName: lastName
                }
            })
            notification.success(t('changeNamesSuccess'), 'top-center');
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                notification.error(t('changeNamesError'), 'top-center');
            }
            return false;
        }
        return true;
    }

    function onFirstNameChanged(value: string) {
        setFirstName(value);
    }

    function onLastNameChanged(value: string) {
        setLastName(value);
    }

    function onFirstNameLostFocus(firstName: string) {
        if (firstName.length > 1) {
            setIsFirstNameValid(true);
        } else {
            setIsFirstNameValid(false);
        }
        setIsFirstNameValidationVisible(true);
    }

    function onLastNameLostFocus(lastName: string) {
        if (lastName.length > 1) {
            setIsLastNameValid(true);
        } else {
            setIsLastNameValid(false);
        }
        setIsLastNameValidationVisible(true);
    }

    return (
        <Modal submit={onSubmit}>
            <Modal.Button>
                <BlackWhiteButton> {t("edit")} <FontAwesomeIcon icon={["fas", "pen-to-square"]} /></BlackWhiteButton>
            </Modal.Button>
            <Modal.Content>
                <form className="space-y-5">
                    <FloatingInput placeholder={`${t('firstName')}`} type='text' inputId="firstNameInput"
                        onChange={(e) => onFirstNameChanged(e.target.value)} value={firstName}
                        onBlur={(e) => onFirstNameLostFocus(e.target.value)}
                        isValid={isFirstNameValid}
                        isValidVisible={isFirstNameValidationVisible} />

                    <FloatingInput placeholder={`${t('lastName')}`} type='text' inputId="lastNameInput"
                        onChange={(e) => onLastNameChanged(e.target.value)} value={lastName}
                        onBlur={(e) => onLastNameLostFocus(e.target.value)}
                        isValid={isLastNameValid}
                        isValidVisible={isLastNameValidationVisible} />
                </form>
            </Modal.Content>
        </Modal>
    )
}