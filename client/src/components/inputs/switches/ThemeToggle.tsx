import { useEffect, useLayoutEffect, useState } from "react";
import { useTheme } from "../../../contexts";
import { Toggle } from "..";

export default function ThemeToggle() {
    const [isToggled, setIsToggled] = useState<boolean>(false);
    const { theme, setTheme } = useTheme();

    useLayoutEffect(() => {
        if(theme ==='dark'){
            setIsToggled(true);
        }
        else{
            setIsToggled(false);
        }
    }, [])

    function saveTheme(theme: string) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setTheme("dark")
            setIsToggled(true);
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setTheme("light")
            setIsToggled(false);
        }
    }

    function onThemeSwitched(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.checked) {
            saveTheme('dark');
        }
        else {
            saveTheme('light');
        }
    }

    return (
        <Toggle checked={isToggled} onChange={(e) => onThemeSwitched(e)} />
    )
}