import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Address, authClient, baseUserURL } from "../../utilities"
import { BlackWhiteButton } from "../buttons"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

interface Props {
    address: Address,
    onDelete: (id: number) => void
}

export default function AddressCard(props: Props) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    function onEdit() {
        navigate('/account/address/edit/id/' + props.address.id, { state: { address: props.address } });
    }

    async function onDelete() {
        try{
            await authClient.delete(`${baseUserURL()}api/user/remove-address/${props.address.id}`)
            props.onDelete(props.address.id);
        }
        catch(error){
            if(axios.isAxiosError(error)){

            }
        }
    }

    return (
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg w-72" >
            <div className="flex flex-col px-4 py-2 gap-2">
                <h1 className="text-black dark:text-white font-bold">{props.address.isDefault == true ? 'Основен адрес' : 'Адрес'}</h1>
                <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={['fas', 'user']} />
                    <div>
                        <span>{props.address.firstName}&nbsp;</span>
                        <span>{props.address.lastName}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={['fas', 'location-dot']} />
                    <span>{props.address.region}</span>
                    <span>{props.address.city}</span>
                    <span>{props.address.streetAddress}</span>
                    <span>{props.address.postalCode}</span>
                </div>
                <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={['fas', 'phone']} />
                    <span>{props.address.phoneNumber}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <BlackWhiteButton className="w-full" onClick={() => onEdit()}>
                        {t("edit")} <FontAwesomeIcon icon={["fas", "pen-to-square"]} />
                    </BlackWhiteButton>
                    <BlackWhiteButton className={`w-full ${props.address.isDefault ? 'invisible' : ''}`}
                        onClick={() => onDelete()}>
                        {t("delete")} <FontAwesomeIcon icon={["fas", "trash"]} />
                    </BlackWhiteButton>
                </div>
            </div>
        </div>
    )
}