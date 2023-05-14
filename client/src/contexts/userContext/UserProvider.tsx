import { useState } from "react";
import { Role, User, UserContext } from ".";
import { authClient, baseURL, removeTokenObject } from "../../utilities";
import axios from "axios";

const initialUser: User = {
    accessToken: '',
    refreshToken: ''
}

export default function UserProvider(props: any) {
    const [user, setUser] = useState<User>(initialUser);
    const [roles, setRoles] = useState<Role[]>([]);
    const [isEmailConfirmed, setIsEmailConfirmed] = useState<boolean>(false);

    async function logout() {
        try {
            var response = await authClient.delete(`${baseURL()}api/authenticate/logout`);
            setUser(initialUser);
            setRoles(['User']);
            setIsEmailConfirmed(false);
            removeTokenObject();
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                setUser(initialUser);
                setRoles(['User']);
                setIsEmailConfirmed(false);
                removeTokenObject();
            }
        }
    }

    return (
        <UserContext.Provider value={{ user: user, setUser: setUser, roles, setRoles, isEmailConfirmed, setIsEmailConfirmed, logout: logout }}>
            {props.children}
        </UserContext.Provider>
    )
}