import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

export default function AddNewAddress() {
    const navigate = useNavigate();

    return (
        <>
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg w-72 cursor-pointer" onClick={() => {navigate('/account/address/add')}}>
                <div className="flex flex-col py-20 items-center">
                    <FontAwesomeIcon icon={['fas', 'plus']} />
                    <div>Добавяне на нов адрес</div>
                </div>
            </div>
        </>
    )
}