import { FormEvent, useEffect, useRef, useState } from "react";
import { BlackWhiteButton, Checkbox, CountriesComboBox, Input, useTitle } from "../../components";
import { useTranslation } from "react-i18next";
import validator from 'validator';
import { InputHandle } from "../../components/inputs/Input";
import { CountriesComboboxHandle } from "../../components/inputs/CountriesComboBox";
import {
    authClient, baseURL, Address, notification, validateCity, validateFirstName, validateLastName,
    validateMobileNumber, validateRegion, validateStreetAddress
} from "../../utilities";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";

let initialInputs: Address = {
    city: '',
    country: '',
    firstName: '',
    id: 0,
    isDefault: false,
    lastName: '',
    phoneNumber: '',
    postalCode: '',
    region: '',
    streetAddress: ''
}

export default function AddressPage() {
    const { t } = useTranslation();
    useTitle(t('title.addNewAddress'));

    const [isEdit, setIsEdit] = useState<boolean>(false);

    const [initial, setInitial] = useState<Address>(initialInputs);

    const [isDefaultAddress, setIsDefaultAddress] = useState<boolean>(false);
    const [isDefaultAddressLocked, setIsDefaultAddressLocked] = useState<boolean>(false);

    const countriesCombobox = useRef<CountriesComboboxHandle>(null);
    const firstNameInput = useRef<InputHandle>(null);
    const lastNameInput = useRef<InputHandle>(null);
    const mobileNumberInput = useRef<InputHandle>(null);
    const streetAddressInput = useRef<InputHandle>(null);
    const postalCodeInput = useRef<InputHandle>(null);
    const regionInput = useRef<InputHandle>(null);
    const cityInput = useRef<InputHandle>(null);

    const { id } = useParams();
    const { state } = useLocation();

    if (id != undefined) {
        async function fetchAddress() {
            try {
                var response = await authClient.get(`${baseURL()}api/user/address/id/${id}`);
                var data = response.data as Address;
                setInitial(data);
                setIsDefaultAddressLocked(data.isDefault);
            }
            catch (error) {
                if (axios.isAxiosError(error)) {

                }
            }
        }
        if (state != null) {
            const { address } = state;

            useEffect(() => {
                if (address != null) {
                    setInitial(address as Address);
                    setIsDefaultAddress((address as Address).isDefault);
                    setIsDefaultAddressLocked((address as Address).isDefault);
                }
                setIsEdit(true);
            }, [address])
        }
        else {
            useEffect(() => {
                fetchAddress();
                setIsEdit(true);
            }, [])
        }
    }

    function onIsDefaultChanged() {
        if (isEdit && isDefaultAddressLocked)
            return;
        setIsDefaultAddress(!isDefaultAddress);
    }

    function validatePostalCode(value: string) {
        return validator.isPostalCode(value, countriesCombobox.current?.selectedCountry.countryCode as validator.PostalCodeLocale);
    }

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isEdit) {
            await edit();
        } else {
            await add();
        }
    }

    function validate() {
        firstNameInput.current!.showValidation();
        lastNameInput.current!.showValidation();
        mobileNumberInput.current!.showValidation();
        streetAddressInput.current!.showValidation();
        postalCodeInput.current!.showValidation();
        regionInput.current!.showValidation();
        cityInput.current!.showValidation();

        if (!firstNameInput.current?.isValid || !lastNameInput.current?.isValid
            || !mobileNumberInput.current?.isValid || !streetAddressInput.current?.isValid
            || !postalCodeInput.current?.isValid || !regionInput.current?.isValid
            || !cityInput.current?.isValid) {
            return false;
        }
        return true;
    }

    async function edit() {
        if (!validate()) {
            return;
        }

        var address = {
            firstName: firstNameInput.current?.value,
            lastName: lastNameInput.current?.value,
            phoneNumber: mobileNumberInput.current?.value,
            streetAddress: streetAddressInput.current?.value,
            country: countriesCombobox.current?.selectedCountry.country,
            region: regionInput.current?.value,
            city: cityInput.current?.value,
            postalCode: postalCodeInput.current?.value,
            isDefault: isDefaultAddress,
            id: initial.id
        }

        try {
            var response = await authClient.put(`${baseURL()}api/user/edit-address`, address);
            setIsDefaultAddressLocked(true);
            notification.success('Successfully eddited your address', 'top-center');
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                notification.error('There was an error editing the address', 'top-center');
            }
        }
    }

    async function add() {
        if (!validate()) {
            return;
        }

        var address = {
            firstName: firstNameInput.current?.value,
            lastName: lastNameInput.current?.value,
            phoneNumber: mobileNumberInput.current?.value,
            streetAddress: streetAddressInput.current?.value,
            country: countriesCombobox.current?.selectedCountry.country,
            region: regionInput.current?.value,
            city: cityInput.current?.value,
            postalCode: postalCodeInput.current?.value,
            isDefault: isDefaultAddress
        }

        try {
            var response = await authClient.post(`${baseURL()}api/user/add-new-address`, address);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                notification.error('There was an error saving the address', 'top-center');
            }
        }
    }

    return (
        <div className="grid grid-cols-4 mx-1 md:ml-5 md:mr-0">
            <div className="col-span-4 lg:col-span-2">
                <h1 className="text-black dark:text-white font-bold mb-5">{t('address.addNewAddress')}</h1>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <div className="grid">
                        <form className="p-5 space-y-5" onSubmit={onSubmit}>
                            <div>
                                <CountriesComboBox labelText={t('address.addNewAddress')} ref={countriesCombobox} />
                                <Input ref={firstNameInput} initialValue={initial.firstName}
                                    type="text" placeholder={t('firstName')}
                                    validate={validateFirstName} immediateValdation={true}
                                    validationMessage={t('errorInput.threeCharactersRequired')!} />
                                <Input ref={lastNameInput} initialValue={initial.lastName}
                                    type="text" placeholder={t('lastName')}
                                    validate={validateLastName} immediateValdation={true}
                                    validationMessage={t('errorInput.threeCharactersRequired')!} />
                                <Input ref={mobileNumberInput} initialValue={initial.phoneNumber}
                                    type="text" placeholder={t('address.mobileTelephoneNumber')}
                                    validate={validateMobileNumber} validateOnLostFocus={true}
                                    validationMessage={t('errorInput.mobileNumberInvalid')!} />
                                <Input ref={streetAddressInput} initialValue={initial.streetAddress}
                                    type="text" placeholder={t('address.address')}
                                    validate={validateStreetAddress} immediateValdation={true}
                                    validationMessage={t('errorInput.fiveCharactersRequired')!} />
                                <Input ref={postalCodeInput} initialValue={initial.postalCode}
                                    type="tel" placeholder={t('address.postCode')}
                                    validate={validatePostalCode} immediateValdation={true}
                                    validationMessage={t('errorInput.postalCodeInvalid')!} />
                                <Input ref={regionInput} initialValue={initial.region}
                                    type="text" placeholder={t('address.region')}
                                    validate={validateRegion} immediateValdation={true}
                                    validationMessage={t('errorInput.twoCharactersRequired')!} />
                                <Input ref={cityInput} initialValue={initial.city}
                                    type="text" placeholder={t('address.city')}
                                    validate={validateCity} immediateValdation={true}
                                    validationMessage={t('errorInput.twoCharactersRequired')!} />
                            </div>

                            <Checkbox
                                id="defaultAddress"
                                checked={isDefaultAddress}
                                onChange={() => onIsDefaultChanged()}
                                labelText={t('address.useDefaultOffice')!} />

                            <BlackWhiteButton>{isEdit ? t('edit') : t('save')}</BlackWhiteButton>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}