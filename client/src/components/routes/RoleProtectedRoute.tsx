import { Navigate, Outlet } from "react-router-dom";
import { Role, useUser } from "../../contexts";
import { Spinner } from "../utilities";

interface Props {
    role: Role
}

export default function RoleProtectedRoute({ role }: Props) {
    const { isUserLoaded, isAuthenticated, roles, isAdmin } = useUser();

    if (!isUserLoaded) {
        return (
            <div className="flex items-center justify-center">
                <Spinner />
            </div>
        )
    }
    
    if (!isAuthenticated || !roles.includes(role) || !isAdmin()) {
        return <Navigate to='/' />
    }

    return <Outlet />
}