import { useTranslation } from "react-i18next";
import { AddNewAddressCard, AddressCard, useTitle } from "../../components";
import { useEffect, useState } from "react";
import { Address, authClient, baseUserURL } from "../../utilities";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function MyAddressesPage() {
    const { t } = useTranslation();
    useTitle(t('title.myAddresses'));

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchAddresses() {
            try {
                setIsLoading(true);
                var response = await authClient.get(`${baseUserURL()}api/user/addresses`);
                var data = response.data as Address[];

                setAddresses(data);
            }
            catch (error) {
                if (axios.isAxiosError(error)) {

                }
            }
            setIsLoading(false);
        }

        fetchAddresses();
    }, [])

    function onDelete(id: number) {
        var newAddresses = addresses.filter(a => a.id != id);
        setAddresses(newAddresses);
    }

    return (
        <div className="mx-1 md:ml-0 md:mr-0 mb-2 md:mb-0">
            <h1 className="text-black dark:text-white font-bold text-2xl mb-5">{t('myAddresses')}</h1>
            <section className="flex flex-wrap gap-4 justify-center sm:justify-start">
                <AddNewAddressCard />
                {isLoading ?
                    <>
                        {new Array(3).fill(null).map((_, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <Skeleton className="w-72 h-60" />
                                </React.Fragment>
                            )
                        })}
                    </>
                    :
                    <>
                        {addresses.sort((a, b) => a.isDefault && !b.isDefault ? -1
                            : !a.isDefault && b.isDefault ? 1 : a.id - b.id).map((address, index) => {
                                return (
                                    <AddressCard key={index} address={address} onDelete={onDelete} />
                                )
                            })}
                    </>
                }
            </section>
        </div>
    )
}