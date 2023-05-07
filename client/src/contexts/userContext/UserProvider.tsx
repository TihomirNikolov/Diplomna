import { useState } from "react";
import { Role, User, UserContext } from ".";
import { authClient, baseURL, notification } from "../../utilities";
import axios from "axios";

const initialUser: User = {
    accessToken: '',
    refreshToken: ''
}

export default function UserProvider(props: any) {
    const [user, setUser] = useState<User>(initialUser);
    const [role, setRole] = useState<Role>('user');
    const [isEmailConfirmed, setIsEmailConfirmed] = useState<boolean>(false);

    async function logout() {
        try {
            var response = await authClient.delete(`${baseURL()}api/authenticate/logout`);
            setUser({ accessToken: '', refreshToken: '' });
            setRole('user');
            setIsEmailConfirmed(false);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                setUser(initialUser);
                setRole('user');
                setIsEmailConfirmed(false);
            }
        }
    }

    return (
        <UserContext.Provider value={{ user: user, setUser: setUser, role, setRole, isEmailConfirmed, setIsEmailConfirmed, logout: logout }}>
            {props.children}
        </UserContext.Provider>
    )
}