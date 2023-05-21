import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BlackWhiteButton, FloatingInput, Modal } from "..";
import { Dispatch, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { UserInfo, authClient, baseUserURL, notification, validateFirstName, validateLastName } from "../../utilities";
import axios from "axios";
import { FloatingInputHandle } from "../inputs/FloatingInput";

interface Props {
    userInfo: UserInfo,
    setUserInfo: Dispatch<React.SetStateAction<UserInfo>>,
}

export default function ChangeName(props: Props) {

    const firstNameInput = useRef<FloatingInputHandle>(null);
    const lastNameInput = useRef<FloatingInputHandle>(null);

    const [initialFirstName, setInitialFirstName] = useState<string>('');
    const [initialLastName, setInitialLastName] = useState<string>('');

    const { t } = useTranslation();

    useEffect(() => {
        setInitialFirstName(props.userInfo.firstName);
        setInitialLastName(props.userInfo.lastName);
    }, [props.userInfo])

    async function onSubmit() {
        if (!firstNameInput.current?.isValid || !lastNameInput.current?.isValid) {
            firstNameInput.current?.showValidation();
            lastNameInput.current?.showValidation();
            return false;
        }
        try {
            var response = await authClient.put(`${baseUserURL()}api/user/change-name`, { firstName: firstNameInput.current?.value, lastName: lastNameInput.current?.value });
            props.setUserInfo((prev: UserInfo) => {
                return {
                    ...prev,
                    firstName: firstNameInput.current?.value!,
                    lastName: lastNameInput.current?.value!
                }
            })
            notification.success(t('responseErrors.changeNamesSuccess'), 'top-center');
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                notification.error(t('responseErrors.changeNamesError'), 'top-center');
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
                <form className="space-y-5">
                    <FloatingInput ref={firstNameInput}
                        inputId="firstNameInput"
                        placeholder={`${t('address.firstName')}`}
                        type='text'
                        initialValue={initialFirstName}
                        validate={validateFirstName} immediateValdation={true}
                        validateOnLostFocus={true}
                        validationMessage={t('errorInput.threeCharactersRequired')!} />

                    <FloatingInput ref={lastNameInput}
                        inputId="lastNameInput"
                        placeholder={`${t('address.lastName')}`}
                        type='text'
                        initialValue={initialLastName}
                        validate={validateLastName} immediateValdation={true}
                        validateOnLostFocus={true}
                        validationMessage={t('errorInput.threeCharactersRequired')!} />
                </form>
            </Modal.Content>
        </Modal>
    )
}