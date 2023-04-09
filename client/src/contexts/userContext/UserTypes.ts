export type User = {
    accessToken: string,
    refreshToken: string,
    role: 'admin' | 'user',
    isEmailConfirmed: boolean
}

export type UserContextType = {
    user: User,
    setUser: (user: User) => void
}