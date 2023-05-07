import { AddNewAddress, Spinner } from "../../components";

export default function MyAddressesPage() {

    return (
        <div>
            <div className="mx-1 md:ml-5 md:mr-0">
                <h1 className="text-black dark:text-white font-bold mb-5">Моите адреси</h1>
                <AddNewAddress/>
            </div>
        </div>
    )
}