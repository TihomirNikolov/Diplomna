import { Address, validateCity, validateFirstName, validateLastName, validateMobileNumber, validateRegion, validateStreetAddress } from "@/utilities";
import { Checkbox, CountriesComboBox, Input } from "../inputs";
import { useTranslation } from "react-i18next";
import validator from "validator";
import { forwardRef, useRef, useImperativeHandle, useState, Dispatch, SetStateAction } from "react";
import { CountriesComboboxHandle } from "../inputs/CountriesComboBox";
import { InputHandle } from "../inputs/Input";

interface Props {
    address: Address,
    setAddress: Dispatch<SetStateAction<Address>>
}

export type AddressComponentHandle = {
    isValid: boolean,
    showValidation: () => void
}

const AddressComponent = forwardRef<AddressComponentHandle, Props>(({ address, setAddress }, ref) => {
    const { t } = useTranslation();

    const countriesCombobox = useRef<CountriesComboboxHandle>(null);
    const firstNameInput = useRef<InputHandle>(null);
    const lastNameInput = useRef<InputHandle>(null);
    const mobileNumberInput = useRef<InputHandle>(null);
    const streetAddressInput = useRef<InputHandle>(null);
    const postalCodeInput = useRef<InputHandle>(null);
    const regionInput = useRef<InputHandle>(null);
    const cityInput = useRef<InputHandle>(null);

    useImperativeHandle(ref, () => ({
        isValid: validate(),
        showValidation: showValidation
    }))

    function validatePostalCode(value: string) {
        return validator.isPostalCode(value, countriesCombobox.current?.selectedCountry.countryCode as validator.PostalCodeLocale);
    }

    function validate() {
        if (!firstNameInput.current?.isValid || !lastNameInput.current?.isValid
            || !mobileNumberInput.current?.isValid || !streetAddressInput.current?.isValid
            || !postalCodeInput.current?.isValid || !regionInput.current?.isValid
            || !cityInput.current?.isValid) {
            return false;
        }
        return true;
    }

    function showValidation() {
        firstNameInput.current!.showValidation();
        lastNameInput.current!.showValidation();
        mobileNumberInput.current!.showValidation();
        streetAddressInput.current!.showValidation();
        postalCodeInput.current!.showValidation();
        regionInput.current!.showValidation();
        cityInput.current!.showValidation();
    }

    return (
        <>
            <div className="col-span-2">
                <CountriesComboBox labelText="" ref={countriesCombobox}
                    onChanged={(country) => setAddress(prev => { return { ...prev, country: country.country } })} />
            </div>
            <Input ref={firstNameInput}
                type="text" placeholder={t('firstName')}
                validate={validateFirstName} immediateValdation={true}
                validationMessage={t('errorInput.threeCharactersRequired')!}
                onChange={(value) => setAddress(prev => { return { ...prev, firstName: value } })} />
            <Input ref={lastNameInput}
                type="text" placeholder={t('lastName')}
                validate={validateLastName} immediateValdation={true}
                validationMessage={t('errorInput.threeCharactersRequired')!}
                onChange={(value) => setAddress(prev => { return { ...prev, lastName: value } })} />
            <Input ref={mobileNumberInput}
                type="text" placeholder={t('address.mobileTelephoneNumber')}
                validate={validateMobileNumber} immediateValdation={true}
                validationMessage={t('errorInput.mobileNumberInvalid')!}
                onChange={(value) => setAddress(prev => { return { ...prev, phoneNumber: value } })} />
            <Input ref={streetAddressInput}
                type="text" placeholder={t('address.address')}
                validate={validateStreetAddress} immediateValdation={true}
                validationMessage={t('errorInput.fiveCharactersRequired')!}
                onChange={(value) => setAddress(prev => { return { ...prev, streetAddress: value } })} />
            <Input ref={postalCodeInput}
                type="tel" placeholder={t('address.postCode')}
                validate={validatePostalCode} immediateValdation={true}
                validationMessage={t('errorInput.postalCodeInvalid')!}
                onChange={(value) => setAddress(prev => { return { ...prev, postalCode: value } })} />
            <Input ref={regionInput}
                type="text" placeholder={t('address.region')}
                validate={validateRegion} immediateValdation={true}
                validationMessage={t('errorInput.twoCharactersRequired')!}
                onChange={(value) => setAddress(prev => { return { ...prev, region: value } })} />
            <Input ref={cityInput}
                type="text" placeholder={t('address.city')}
                validate={validateCity} immediateValdation={true}
                validationMessage={t('errorInput.twoCharactersRequired')!}
                onChange={(value) => setAddress(prev => { return { ...prev, city: value } })} />
        </>
    )
})

export default AddressComponent;