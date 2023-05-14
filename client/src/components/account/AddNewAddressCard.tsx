import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function AddNewAddressCard() {
    const navigate = useNavigate();
    const {t} = useTranslation();

    return (
        <>
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg w-72 cursor-pointer" onClick={() => {navigate('/account/address/add')}}>
                <div className="flex flex-col py-24 items-center">
                    <FontAwesomeIcon icon={['fas', 'plus']} />
                    <div>{t('address.addNewAddress')}</div>
                </div>
            </div>
        </>
    )
}