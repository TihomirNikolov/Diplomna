import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../contexts";

export default function AuthRoute(){
    const { user } = useUser();

    if(user.accessToken != null && user.accessToken != ''){
        return <Navigate to='/'/>
    }

    return <Outlet/>
}