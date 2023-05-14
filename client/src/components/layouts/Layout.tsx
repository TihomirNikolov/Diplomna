import { useTheme, useUser } from "../../contexts";
import { SearchBar, Profile, LanguageSelector, ShoppingCart, Favourites } from "..";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useLayoutEffect } from "react";
import { authClient, baseURL, notification } from "../../utilities";
import axios from "axios";


export default function Layout(props: any) {
    const { user, isEmailConfirmed } = useUser();
    const { setTheme } = useTheme();

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
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setTheme("light")
        }
    }

    async function resendEmail() {
        try {
            var response = await authClient.post(`${baseURL()}api/user/resend-email-verification`);

            notification.info(t('responseErrors.resentVerificationEmailSuccess'), 'top-center');
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                notification.error(t('responseErrors.resentVerificationEmailError'), 'top-center')
            }
        }
    }

    return (
        <>
            <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2 dark:bg-gray-800 sticky top-0">
                <div className="grid grid-cols-3">
                    <div className="flex justify-center items-center">
                        <Link to='/' className="text-white">Home</Link>
                    </div>
                    <div className="flex justify-center items-center">
                        <SearchBar />
                    </div>
                    <div className="flex justify-end items-center lg:order-2 space-x-2">
                        <LanguageSelector />
                        {user.accessToken.length > 0 && <Favourites />}
                        <Profile />
                        <ShoppingCart />
                    </div>
                </div>
            </nav>
            {user.accessToken.length > 0 && !isEmailConfirmed &&
                <div className="grid place-items-center">
                    <h1 className="text-black dark:text-white">
                        {t('emailNotConfirmed')}&nbsp;
                        <span className="underline hover:text-blue-600 cursor-pointer" onClick={async () => resendEmail()}>{t('resendEmail')}</span>
                    </h1>
                </div>}
        </>
    )
}
