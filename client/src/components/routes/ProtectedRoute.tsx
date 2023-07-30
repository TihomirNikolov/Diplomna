import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../contexts";
import { Spinner } from "../utilities";

export default function ProtectedRoute() {
    const { user, isUserLoaded, isAuthenticated } = useUser();

    if (!isUserLoaded) {
        return (
            <div className="flex items-center justify-center">
                <Spinner />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to='/' />
    }

    return <Outlet />
}