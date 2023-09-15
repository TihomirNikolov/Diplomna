import { useEffect, useState } from "react";
import { Role, User, UserContext } from ".";
import { authClient, baseProductsURL, baseUserURL, getTokenObject, removeTokenObject } from "../../utilities";
import axios from "axios";

const initialUser: User = {
    accessToken: '',
    refreshToken: ''
}

export default function UserProvider(props: any) {
    const [user, setUser] = useState<User>(initialUser);
    const [roles, setRoles] = useState<Role[]>([]);
    const [isEmailConfirmed, setIsEmailConfirmed] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    async function fetchRole() {
        if (getTokenObject() != null) {
            try {
                var response = await authClient.get(`${baseUserURL()}api/user/roles`);
                var data = response.data as Role[]
                setRoles(data);
            }
            catch (error) {
                setRoles(['User'])
            }
        }
        else {
            setRoles(['User']);
        }
    }

    async function fetchIsEmailConfirmed() {
        if (getTokenObject() != null) {
            try {
                var response = await authClient.get(`${baseUserURL()}api/user/emailVerification`);
                var data = response.data as boolean;
                setIsEmailConfirmed(data);
            }
            catch (error) {
                setIsEmailConfirmed(false);
            }
        } else {
            setIsEmailConfirmed(false);
        }
    }

    useEffect(() => {
        var userObject = getTokenObject();
        if (userObject == null) {
            userObject = { accessToken: '', refreshToken: '' }
            setIsAuthenticated(false);
        }
        else {
            setIsAuthenticated(true);
        }
        setUser(userObject);
        setIsLoaded(true);
        fetchRole();
        fetchIsEmailConfirmed();
    }, [])

    async function logout() {
        try {
            await authClient.delete(`${baseUserURL()}api/authenticate/logout`);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
            }
        }
        setUser(initialUser);
        setRoles(['User']);
        setIsEmailConfirmed(false);
        removeTokenObject();
        setIsAuthenticated(false);
    }

    function isAdmin(){
        return roles.includes('Administrator');
    }

    function isEmployee(){
        return roles.includes('Employee') || roles.includes('Administrator')
    }

    function isModerator(){
        return roles.includes('Moderator') || roles.includes('Administrator')
    }

    function isOwner(){
        return roles.includes('Owner') || roles.includes('Administrator')
    }

    return (
        <UserContext.Provider value={{
            user: user, setUser: setUser, roles, setRoles,
            isEmailConfirmed, setIsEmailConfirmed, logout: logout,
            isAuthenticated: isAuthenticated, setIsAuthenticated: setIsAuthenticated,
            isUserLoaded: isLoaded, isAdmin: isAdmin, isEmployee: isEmployee,
            isModerator: isModerator, isOwner: isOwner
        }}>
            {props.children}
        </UserContext.Provider>
    )
}