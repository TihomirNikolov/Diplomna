import { useLayoutEffect, useState } from "react"
import { useTheme, useUser } from "../../contexts";
import { LanguageSelector } from "../utilities";
import { Toggle } from "../inputs";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../utilities";

export default function Layout(props: any) {
    const [isToggled, setIsToggled] = useState<boolean>(false);
    const { setTheme } = useTheme();
    const { user, setUser } = useUser()

    const { t } = useTranslation();

    useLayoutEffect(() => {
        if (localStorage.getItem('theme') === null) {
            if (window.matchMedia('(prefers-color-scheme:dark)').matches) {
                saveTheme('dark');
            }
            else {
                saveTheme('light');
            }
        }
        else {
            if (localStorage.getItem('theme') === 'dark') {
                saveTheme('dark');
            }
            else {
                saveTheme('light');
            }
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

    async function onLoggedOut() {

        const config = {
            headers: { Authorization: `Bearer ${user.accessToken}`,
                        RefreshToken: user.refreshToken }
        };

        try {
            var response = await axios.post(`${baseURL()}api/authenticate/logout`,{}, config);

            setUser({ accessToken: '', refreshToken: '', role: 'user', isEmailConfirmed: false })
            localStorage.removeItem('refresh');
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
        }
    }

    return (
        <>
            <nav className="bg-white border-gray-200 px-4 lg:px-6 py-5 dark:bg-gray-800">
                <div className="flex flex-wrap justify-between items-center">
                    <div className="flex justify-start items-center">
                        <Link to='/home' className="text-white">Home</Link>
                    </div>
                    <div className="flex items-center lg:order-2 space-x-2">
                        <div>
                            <LanguageSelector />
                        </div>
                        <Toggle checked={isToggled} onChange={(e) => onThemeSwitched(e)} />
                        {user.accessToken == null || user.accessToken == '' ? (
                            <Link to='/login' className="text-white bg-blue-600 rounded-full text-center shadow-lg
                                                        w-20 py-1.5 hover:bg-blue-700">
                                {t("signIn")}
                            </Link>) : (
                            <Link to='/logout' className="text-white bg-blue-600 rounded-full text-center shadow-lg
                                                         w-20 py-1.5 hover:bg-blue-700"
                                onClick={onLoggedOut}>
                                {t("signOut")}
                            </Link>)}

                    </div>
                </div>
            </nav>
            {user.accessToken && !user.isEmailConfirmed &&
                <div className="grid place-items-center">
                    <h1 className="text-white">EMAIL NOT CONFIRMED</h1>
                </div>}
        </>
    )
}
