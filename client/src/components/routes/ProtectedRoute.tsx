import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../contexts";
import { Spinner } from "../utilities";

interface Props{
    isLoading: boolean
}

export default function ProtectedRoute(props: Props) {
    const { user } = useUser();

    if(props.isLoading){
        return <Spinner/>
    }

    if (user.accessToken != null && !user.accessToken) {
        return <Navigate to='/' />
    }

    return <Outlet />
}