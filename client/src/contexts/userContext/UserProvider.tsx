import { useState } from "react";
import { User, UserContext } from ".";

const initialState: User = {
    accessToken: '',
    refreshToken: '',
    role: "user",
    isEmailConfirmed: false
}

export default function UserProvider(props: any) {
    const [user, setUser] = useState<User>(initialState);

    return (
        <UserContext.Provider value={{ user: user, setUser: setUser }}>
            {props.children}
        </UserContext.Provider>
    )
}