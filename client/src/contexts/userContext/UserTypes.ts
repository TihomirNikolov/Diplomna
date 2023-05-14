export type User = {
    accessToken: string,
    refreshToken: string
}

export type Role = 'Owner' | 'Administrator' | 'Moderator' |  'User';

export type UserContextType = {
    user: User,
    setUser: (user: User) => void,
    roles: Role[],
    setRoles: (roles: Role[]) => void,
    isEmailConfirmed: boolean,
    setIsEmailConfirmed: (isEmailConfirmed: boolean) => void,
    logout: () => Promise<void>;
}