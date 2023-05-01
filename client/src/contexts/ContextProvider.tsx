import { ThemeProvider, UserProvider } from ".";

export default function ContextProvider(props: any) {

    return (
        <UserProvider>
            <ThemeProvider>
                {props.children}
            </ThemeProvider>
        </UserProvider>
    )
}