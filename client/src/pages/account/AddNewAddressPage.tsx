import { FormEvent, useState } from "react";
import { BlackWhiteButton, Checkbox, FloatingInput, RadioButton } from "../../components";
import { useTranslation } from "react-i18next";

type DeliveryType = "Address" | "EcontOffice" | "SpeedyOffice"

export default function AddNewAddressPage() {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [telNumber, setTelNumber] = useState<string>('');
    const [deliveryType, setDeliveryType] = useState<DeliveryType>('Address');
    const [isDefaultAddress, setIsDefaultAddress] = useState<boolean>(false);

    const [isFirstNameValid, setIsFirstNameValid] = useState<boolean>();
    const [isLastNameValid, setIsLastNameValid] = useState<boolean>();
    const [isTelNumberValid, setIsTelNumberValid] = useState<boolean>();

    const [isFirstNameValidationVisible, setIsFirstNameValidationVisible] = useState<boolean>();
    const [isLastNameValidationVisible, setIsLastNameValidationVisible] = useState<boolean>();
    const [isTelNumberValidationVisible, setIsTelNumberValidationVisible] = useState<boolean>();

    const { t } = useTranslation();

    function onFirstNameChange(value: string) {
        setFirstName(value);
    }

    function onLastNameChange(value: string) {
        setLastName(value);
    }

    function onTelNumberChange(value: string) {
        setTelNumber(value);
    }

    function onFirstNameLostFocus(firstName: string) {
        if (firstName.length > 1) {
            setIsFirstNameValid(true);
        }
        else {
            setIsFirstNameValid(false);
        }
        setIsFirstNameValidationVisible(true);
    }

    function onLastNameLostFocus(lastName: string) {
        if (lastName.length > 1) {
            setIsLastNameValid(true);
        }
        else {
            setIsLastNameValid(false);
        }
        setIsLastNameValidationVisible(true);
    }

    function onTelNumberLostFocus(telNumber: string) {
        if (telNumber.match(/^\+3598[7|8|9][0-9]{7}|08[7|8|9][0-9]{7}$/)) {
            setIsTelNumberValid(true);
        }
        else {
            setIsTelNumberValid(false);
        }
        setIsTelNumberValidationVisible(true);
    }

    function onDeliveryTypeChange(value: DeliveryType) {
        setDeliveryType(value);
    }

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!isFirstNameValid || !isLastNameValid || !isTelNumberValid) {
            setIsFirstNameValidationVisible(true);
            setIsLastNameValidationVisible(true);
            setIsTelNumberValidationVisible(true);
            return;
        }
    }

    return (
        <div className="grid grid-cols-3 mx-1 md:ml-5 md:mr-0">
            <div className="col-span-3 md:col-span-2">
                <h1 className="text-black dark:text-white font-bold mb-5">{t('addNewAddress')}</h1>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <div className="grid xl:grid-cols-2">
                        <form className="p-5 space-y-5" onSubmit={onSubmit}>
                            <FloatingInput
                                inputId="FirstNameInput" placeholder={t('name')}
                                type="text" value={firstName}
                                onChange={(e) => onFirstNameChange(e.target.value)}
                                onBlur={(e) => onFirstNameLostFocus(e.target.value)}
                                isValid={isFirstNameValid}
                                isValidVisible={isFirstNameValidationVisible} />
                            <FloatingInput
                                inputId="LastNameInput" placeholder={t('lastName')}
                                type="text" value={lastName}
                                onChange={(e) => onLastNameChange(e.target.value)}
                                onBlur={(e) => onLastNameLostFocus(e.target.value)}
                                isValid={isLastNameValid}
                                isValidVisible={isLastNameValidationVisible} />
                            <FloatingInput
                                inputId="TelInput" placeholder={t('mobileTelephoneNumber')}
                                type="tel" value={telNumber}
                                onChange={(e) => onTelNumberChange(e.target.value)}
                                onBlur={(e) => onTelNumberLostFocus(e.target.value)}
                                isValid={isTelNumberValid}
                                isValidVisible={isTelNumberValidationVisible} />

                            <RadioButton radioGroup="deliveryType"
                                id="HomeAddress" labelText={t('toOffice')}
                                onChange={() => onDeliveryTypeChange("Address")}
                                checked={deliveryType == 'Address'}
                                value='Address' />
                            <RadioButton radioGroup="deliveryType"
                                id="EccntAddress" labelText={t('toEcontOffice')}
                                onChange={() => onDeliveryTypeChange("EcontOffice")}
                                checked={deliveryType == 'EcontOffice'}
                                value='EcontOffice' />
                            <RadioButton radioGroup="deliveryType"
                                id="SpeedyAddress" labelText={t('toSpeedyOffice')}
                                onChange={() => onDeliveryTypeChange("SpeedyOffice")}
                                checked={deliveryType == 'SpeedyOffice'}
                                value='SpeedyOffice' />

                            <Checkbox id="defaultAddress"
                                checked={isDefaultAddress}
                                onChange={() => setIsDefaultAddress(!isDefaultAddress)}
                                labelText={t('useDefaultOffice')!} />

                            <BlackWhiteButton>{t('save')}</BlackWhiteButton>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}