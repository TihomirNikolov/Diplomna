import { useState } from "react"
import { Theme, ThemeContext } from "."


export default function ThemeProvider(props : any){
    const [theme, setTheme] = useState<Theme>('light')
    return(
        <ThemeContext.Provider value = {{theme: theme, setTheme: setTheme}}>
            {props.children}
        </ThemeContext.Provider>
    )
}