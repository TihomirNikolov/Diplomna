import { useNavigate, useParams } from "react-router-dom";
import { Spinner, usePut } from "../../components";
import { axiosClient, baseURL } from "../../utilities";
import { useEffect, useState } from "react";
import { useUser } from "../../contexts";

export default function ChangeEmailPage() {
    const { emailChangeToken } = useParams();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSuccess, setIsSuccess] = useState<boolean>();

    const { logout } = useUser();

    const navigate = useNavigate();

    useEffect(() => {
        async function fetch() {
            try {
                setIsLoading(true);
                var response = await axiosClient.put(`${baseURL()}api/user/change-email/${emailChangeToken!}`);
                setIsSuccess(true);
                await logout();
                navigate('');
            }
            catch (error) {
                setIsSuccess(false);
            }
            finally {
                setIsLoading(false);
            }
        }

        fetch();
    }, []);

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
                <h1 className="text-black dark:text-white">SUCESSFULLY CHANGED EMAIL</h1>
            </div>
        )
    }
    else {
        return (
            <div className="grid h-[calc(100vh-50px)] place-items-center">
                <h1 className="text-black dark:text-white">EMAIL CHANGE TOKEN HAS EXPIRED OR IT ISNT VALID</h1>
            </div>
        )
    }
}