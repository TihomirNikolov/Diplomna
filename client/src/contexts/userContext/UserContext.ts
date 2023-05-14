import { createContext, useContext } from "react";
import { UserContextType } from ".";

export const UserContext = createContext<UserContextType>({
    user: { accessToken: '', refreshToken: '' }, setUser: user => console.log('no user'),
    roles: [], setRoles: roles => console.log('no role'), isEmailConfirmed: false,
    setIsEmailConfirmed: isEmailConfirmed => console.log('no isEmailConfirmed'),
    logout: async () => console.log("failed to log out")
});

export const useUser = () => useContext(UserContext);