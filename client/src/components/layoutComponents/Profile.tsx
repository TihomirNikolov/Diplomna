import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThemeToggle } from "../inputs";
import Dropdown from "../utilities/Dropdown";
import { useUser } from "../../contexts";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


export default function Profile() {
    const { user, logout } = useUser();
    const { t } = useTranslation();

    const navigate = useNavigate();

    async function onLoggedOut() {
        await logout();
        navigate('');
    }

    function isLoggedIn() {
        if (user.accessToken == null || user.accessToken == '') {
            return false;
        }
        return true;
    }

    return (
        <Dropdown>
            <Dropdown.Header>
                <div
                    className="inline-block cursor-pointer">
                    <FontAwesomeIcon icon={['fas', 'circle-user']} size="2x" className="text-blue-400" />
                </div>
            </Dropdown.Header>
            <Dropdown.Item>
                <div className="py-2 w-40 rounded-lg bg-lightBackground dark:bg-gray-700 
                                shadow-lg cursor-pointer text-black dark:text-white ">
                    <div className="flex rounded-lg hover:bg-gray-500 hover:dark:bg-gray-500">
                        {!isLoggedIn() ? (
                            <Link to='/login' className="text-center w-full py-1">
                                {t("signIn")}
                            </Link>
                        ) :
                            <Link to='/account' className="text-center w-full py-1">
                                {t("account")}
                            </Link>}
                    </div>

                    <div className="grid grid-flow-col place-items-end items-center rounded-lg py-1 px-1">
                        <label>{t("darkTheme")}</label>
                        <ThemeToggle />
                    </div>

                    <div className="flex rounded-lg hover:bg-gray-500 hover:dark:bg-gray-500">
                        {isLoggedIn() && (
                            (
                                <Link to='/logout' className="text-center w-full py-1"
                                    onClick={onLoggedOut}>
                                    {t("signOut")}
                                </Link>)
                        )}
                    </div>
                </div>
            </Dropdown.Item>
        </Dropdown>
    )
}