import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function AddNewAddressCard() {
    const { t } = useTranslation();

    return (
        <>
            <Link to='/account/address/add' className="bg-white dark:bg-gray-700 rounded-lg shadow-lg w-72 cursor-pointer">
                <div className="flex flex-col py-24 items-center">
                    <FontAwesomeIcon icon={['fas', 'plus']} />
                    <div>{t('address.addNewAddress')}</div>
                </div>
            </Link>
        </>
    )
}