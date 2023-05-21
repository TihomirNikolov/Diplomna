import { useTheme, useUser } from "../../contexts";
import { SearchBar, Profile, LanguageSelector, ShoppingCart, Favourites, CategoriesComponent } from "..";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";
import { Category, authClient, axiosClient, baseUserURL, notification } from "../../utilities";
import axios from "axios";

interface Props{
    isLoading: boolean
}

export default function Layout(props: Props) {
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
        <>
            <nav className="bg-white border-gray-200 dark:bg-gray-800 sticky top-0 z-50">
                <div className="grid grid-cols-2 sm:grid-cols-3 py-4">
                    <div className="grid grid-cols-4 items-center">
                        <div className="md:hidden">
                            <CategoriesComponent />
                        </div>
                        <div className="col-start-3">
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
                <div className="md:grid md:grid-cols-12 hidden bg-gray-100 dark:bg-gray-700 shadow-lg">
                    <div className="col-start-3 col-span-2">
                        <CategoriesComponent />
                    </div>
                </div>
                <div className="md:grid md:grid-cols-12 hidden bg-lightBackground dark:bg-darkBackground-900">
                    <div className="col-start-3 col-span-8 border-b border-gray-300 py-2">
                        navbar
                    </div>
                </div>
            </nav>
            { user.accessToken.length > 0 && !isEmailConfirmed &&
                <div className="grid place-items-center">
                    <h1 className="text-black dark:text-white">
                        {t('emailNotConfirmed')}&nbsp;
                        <span className="underline hover:text-blue-600 cursor-pointer" onClick={async () => resendEmail()}>{t('resendEmail')}</span>
                    </h1>
                </div>}
        </>
    )
}
