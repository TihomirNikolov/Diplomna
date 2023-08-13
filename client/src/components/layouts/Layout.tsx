import { useTheme, useUser } from "../../contexts";
import { SearchBar, Profile, LanguageSelector, ShoppingCart, Favourites, CategoriesComponent } from "..";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";
import { Category, authClient, axiosClient, baseUserURL, notification } from "../../utilities";
import axios from "axios";

export default function Layout() {
    const { user, isEmailConfirmed, isAuthenticated, isUserLoaded } = useUser();
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
            var response = await authClient.post(`${baseUserURL()}api/user/resend-email-verification`);

            notification.info(t('responseErrors.resentVerificationEmailSuccess'), 'top-center');
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                notification.error(t('responseErrors.resentVerificationEmailError'), 'top-center')
            }
        }
    }

    return (
        <header className="sticky top-0 z-40">
            <nav className="bg-white border-gray-200 dark:bg-gray-800">
                <div className="grid grid-cols-2 sm:grid-cols-3 py-4">
                    <div className="grid grid-cols-4 items-center">
                        <div className="md:hidden">
                            <CategoriesComponent />
                        </div>
                        <div className="flex justify-center md:justify-start col-start-2 col-span-2 md:col-start-3 md:col-span-1">
                            <Link to='/' className="text-white">Home</Link>
                        </div>
                    </div>
                    <div className="sm:flex justify-center items-center hidden">
                        <SearchBar />
                    </div>
                    <div className="flex justify-end items-center lg:order-2 space-x-2 mr-6">
                        <LanguageSelector />
                        {user.accessToken.length > 0 && <Favourites />}
                        <Profile />
                        <ShoppingCart />
                    </div>
                </div>
                <div className="md:grid md:grid-cols-12 hidden shadow-lg">
                    <div className="col-start-3 col-span-2">
                        <CategoriesComponent />
                    </div>
                </div>
                <div className="flex justify-center items-center mx-4 sm:hidden">
                    <SearchBar />
                </div>
            </nav>
            {isUserLoaded && isAuthenticated && !isEmailConfirmed &&
                <div className="grid place-items-center">
                    <h1 className="text-black dark:text-white">
                        {t('emailNotConfirmed')}&nbsp;
                        <span className="underline hover:text-blue-600 cursor-pointer" onClick={async () => resendEmail()}>{t('resendEmail')}</span>
                    </h1>
                </div>}
        </header>
    )
}
