import { createContext, useContext } from "react";
import { UserContextType } from ".";

export const UserContext = createContext<UserContextType>({user: { accessToken: '', refreshToken:'', role: "user", isEmailConfirmed: false}, setUser: user => console.log('no user')});

export const useUser = () => useContext(UserContext);