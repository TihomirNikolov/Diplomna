import { SetStateAction } from "react";

export type User = {
    accessToken: string,
    refreshToken: string
}

export type Role = 'Owner' | 'Administrator' | 'Moderator' | 'User';

export type UserContextType = {
    user: User,
    setUser: (user: SetStateAction<User>) => void,
    roles: Role[],
    setRoles: (roles: SetStateAction<Role[]>) => void,
    isEmailConfirmed: boolean,
    setIsEmailConfirmed: (isEmailConfirmed: SetStateAction<boolean>) => void,
    logout: () => Promise<void>;
}