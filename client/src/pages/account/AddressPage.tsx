import { FormEvent, useEffect, useRef, useState } from "react";
import { AddressComponent, BlackWhiteButton, Checkbox, CountriesComboBox, Input, useTitle } from "../../components";
import { useTranslation } from "react-i18next";
import validator from 'validator';
import { InputHandle } from "../../components/inputs/Input";
import { CountriesComboboxHandle } from "../../components/inputs/CountriesComboBox";
import {
    authClient, baseUserURL, Address, notification, validateCity, validateFirstName, validateLastName,
    validateMobileNumber, validateRegion, validateStreetAddress
} from "../../utilities";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { AddressComponentHandle } from "@/components/account/AddressComponent";

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

    const addressRef = useRef<AddressComponentHandle>(null);

    const { id } = useParams();
    const { state } = useLocation();

    if (id != undefined) {
        async function fetchAddress() {
            try {
                var response = await authClient.get(`${baseUserURL()}api/user/address/id/${id}`);
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

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isEdit) {
            await edit();
        } else {
            await add();
        }
    }

    async function edit() {
        if (!addressRef.current?.isValid) {
            addressRef.current?.showValidation();
            return;
        }

        var address = {
            firstName: addressRef.current?.address.firstName,
            lastName: addressRef.current?.address.lastName,
            phoneNumber: addressRef.current?.address.phoneNumber,
            streetAddress: addressRef.current?.address.streetAddress,
            country: addressRef.current?.address.country,
            region: addressRef.current?.address.region,
            city: addressRef.current?.address.city,
            postalCode: addressRef.current?.address.postalCode,
            isDefault: isDefaultAddress,
            id: initial.id
        }

        try {
            var response = await authClient.put(`${baseUserURL()}api/user/edit-address`, address);
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
        if (!addressRef.current?.isValid) {
            addressRef.current?.showValidation();
            return;
        }

        var address = {
            firstName: addressRef.current?.address.firstName,
            lastName: addressRef.current?.address.lastName,
            phoneNumber: addressRef.current?.address.phoneNumber,
            streetAddress: addressRef.current?.address.streetAddress,
            country: addressRef.current?.address.country,
            region: addressRef.current?.address.region,
            city: addressRef.current?.address.city,
            postalCode: addressRef.current?.address.postalCode,
            isDefault: isDefaultAddress
        }

        try {
            var response = await authClient.post(`${baseUserURL()}api/user/add-new-address`, address);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                notification.error('There was an error saving the address', 'top-center');
            }
        }
    }

    return (
        <div className="grid grid-cols-4 mx-1 md:ml-0 md:mr-0">
            <div className="col-span-4 lg:col-span-2">
                <h1 className="text-black dark:text-white font-bold mb-5">{t('address.addNewAddress')}</h1>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <div className="grid">
                        <form className="p-5 space-y-5" onSubmit={onSubmit}>
                            <div>
                                <AddressComponent ref={addressRef}/>
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