import { useTranslation } from "react-i18next";
import { AddNewAddressCard, AddressCard, useTitle } from "../../components";
import { useEffect, useState } from "react";
import { Address, authClient, baseURL } from "../../utilities";
import axios from "axios";

export default function MyAddressesPage() {
    const { t } = useTranslation();
    useTitle(t('title.myAddresses'));

    const [addresses, setAddresses] = useState<Address[]>([]);

    useEffect(() => {
        async function fetchAddresses() {
            try {
                var response = await authClient.get(`${baseURL()}api/user/addresses`);
                var data = response.data as Address[];

                setAddresses(data);
            }
            catch (error) {
                if (axios.isAxiosError(error)) {

                }
            }
        }

        fetchAddresses();
    }, [])

    return (
        <div>
            <div className="mx-1 md:ml-5 md:mr-0">
                <h1 className="text-black dark:text-white font-bold mb-5">Моите адреси</h1>
                <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                    <AddNewAddressCard />
                    {addresses.sort((a, b) => a.isDefault && !b.isDefault ? -1
                        : !a.isDefault && b.isDefault ? 1 : a.id - b.id).map((address, index) => {
                            return (
                                <AddressCard key={index} address={address} />
                            )
                        })}
                </div>
            </div>
        </div>
    )
}