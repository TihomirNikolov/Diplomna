import { Address, authClient, baseUserURL } from "@/utilities";
import { Listbox, Transition } from "@headlessui/react";
import {
  Dispatch,
  Fragment,
  SetStateAction,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { AddressComponent } from "../account";
import { Checkbox } from "../inputs";
import { useTranslation } from "react-i18next";
import { AddressComponentHandle } from "../account/AddressComponent";
import axios from "axios";
import { useUser } from "@/contexts";

const createNewAddress: Address = {
  city: "",
  country: "",
  firstName: "",
  id: 0,
  isDefault: false,
  lastName: "",
  phoneNumber: "",
  postalCode: "",
  region: "",
  streetAddress: "",
};

export type FinishPageAddressHandle = {
  validate: () => boolean;
  isNewAddress: boolean;
};

interface Props {
  address: Address;
  setAddress: Dispatch<SetStateAction<Address>>;
}

const FinishPageAddressComponent = forwardRef<FinishPageAddressHandle, Props>(
  ({ address, setAddress }, ref) => {
    const { t } = useTranslation();
    const [selectedAddress, setSelectedAddress] =
      useState<Address>(createNewAddress);

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isDefaultAddress, setIsDefaultAddress] = useState<boolean>(false);

    const addressRef = useRef<AddressComponentHandle>(null);

    const { isAuthenticated } = useUser();

    useImperativeHandle(ref, () => ({
      validate: () => {
        addressRef.current?.showValidation();
        return (
          addressRef.current?.isValid || selectedAddress != createNewAddress
        );
      },
      isNewAddress: selectedAddress == createNewAddress,
    }));

    async function fetchAddresses() {
      try {
        var response = await authClient.get(
          `${baseUserURL()}api/user/addresses`,
        );
        var data = response.data as Address[];

        setAddresses(data);
        if (data.length > 0) {
          setSelectedAddress(data[0]);
          setAddress(data[0]);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
        }
      }
    }

    useEffect(() => {
      if (isAuthenticated) {
        fetchAddresses();
      }
    }, []);

    function onIsDefaultChanged() {
      setIsDefaultAddress(!isDefaultAddress);
    }

    function onAddressChanged(address: Address) {
      setSelectedAddress(address);
      setAddress(address);
    }

    return (
      <>
        {isAuthenticated && (
          <Listbox value={selectedAddress} onChange={onAddressChanged}>
            {({ open }) => (
              <>
                <div className="relative w-full py-5">
                  <Listbox.Button
                    className="sm:leading- relative w-full rounded-md border border-gray-300
                                        bg-transparent px-1.5
                                         py-3 text-start text-gray-900 dark:border-gray-800 dark:text-white sm:text-sm"
                  >
                    <span className="text-xl">
                      {selectedAddress != createNewAddress ? (
                        <span>
                          {selectedAddress.country} {selectedAddress.region}{" "}
                          {selectedAddress.city} {selectedAddress.streetAddress}{" "}
                          {selectedAddress.postalCode}
                        </span>
                      ) : (
                        <span>{t("address.createNewAddress")}</span>
                      )}
                    </span>
                  </Listbox.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 w-full rounded-lg bg-white px-2 shadow-lg dark:bg-darkBackground-800">
                      {addresses.map((address, index) => {
                        return (
                          <Listbox.Option
                            value={address}
                            key={index}
                            className="w-full cursor-pointer py-1 text-xl text-black
                                                    hover:text-orange-500 dark:text-white hover:dark:text-orange-500"
                          >
                            <span>
                              {address.country} {address.region} {address.city}{" "}
                              {address.streetAddress} {address.postalCode}
                            </span>
                          </Listbox.Option>
                        );
                      })}
                      <Listbox.Option
                        value={createNewAddress}
                        className="w-full cursor-pointer py-1 text-xl text-black
                                                    hover:text-orange-500 dark:text-white hover:dark:text-orange-500"
                      >
                        <span>{t("address.createNewAddress")}</span>
                      </Listbox.Option>
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
        )}

        {(selectedAddress == createNewAddress || !isAuthenticated) && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <AddressComponent
                ref={addressRef}
                address={address}
                setAddress={setAddress}
              />
            </div>

            <Checkbox
              id="defaultAddress"
              checked={isDefaultAddress}
              onChange={() => onIsDefaultChanged()}
              labelText={t("address.useDefaultOffice")!}
            />
          </>
        )}
      </>
    );
  },
);

export default FinishPageAddressComponent;
