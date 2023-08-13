import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../contexts";
import { Spinner } from "../utilities";

export default function UserLoadedRoute() {
    const { isUserLoaded } = useUser();

    if (!isUserLoaded) {
        return (
            <div className="flex items-center justify-center">
                <Spinner />
            </div>
        )
    }

    return <Outlet />
}