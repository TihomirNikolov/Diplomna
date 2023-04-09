import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../contexts";

export default function ProtectedRoute() {
    const { user } = useUser();

    if(!user.accessToken){
        return <Navigate to='/'/>
    }

    return <Outlet/>
}