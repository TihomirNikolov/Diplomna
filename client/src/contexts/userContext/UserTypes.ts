export type User = {
    accessToken: string,
    refreshToken: string
}

export type Role = 'admin' | 'user';

export type UserContextType = {
    user: User,
    setUser: (user: User) => void,
    role: Role,
    setRole: (role: Role) => void,
    isEmailConfirmed: boolean,
    setIsEmailConfirmed: (isEmailConfirmed: boolean) => void,
    logout: () => Promise<void>;
}