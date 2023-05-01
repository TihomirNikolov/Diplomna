import { useParams } from "react-router-dom";
import { baseURL } from "../../utilities";
import { Spinner, useGet } from "../../components";

export default function ConfrimEmailPage() {

    const { emailConfirmToken } = useParams();

    const { isLoading, isSuccess } = useGet<boolean>(`${baseURL()}api/user/verify-email/${emailConfirmToken!}`);

    if (isLoading) {
        return (
            <div className="grid h-[calc(100vh-50px)] place-items-center">
                <Spinner />
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className="grid h-[calc(100vh-50px)] place-items-center">
                <h1 className="text-black dark:text-white">SUCESSFULLY CONFIRMED EMAIL</h1>
            </div>
        )
    }
    else {
        return (
            <div className="grid h-[calc(100vh-50px)] place-items-center">
                <h1 className="text-black dark:text-white">EMAIL CONFIRMATION TOKEN HAS EXPIRED OR IT ISNT VALID</h1>
            </div>
        )
    }
}