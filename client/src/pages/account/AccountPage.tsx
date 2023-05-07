import { useEffect, useState } from "react";
import { LoginInfo, UserInfo, authClient, baseURL, notification } from "../../utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BlackWhiteButton, ChangeEmail, ChangeName, ChangePassword } from "../../components";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useUser } from "../../contexts";
import { useNavigate } from "react-router-dom";

const initalUserInfo: UserInfo = {
    email: '',
    firstName: '',
    lastName: ''
}

export default function AccountPage() {
    const [loginInfo, setLoginInfo] = useState<LoginInfo[]>([])
    const [userInfo, setUserInfo] = useState<UserInfo>(initalUserInfo);

    const { user, logout } = useUser();

    const { t } = useTranslation();

    const navigate = useNavigate();

    useEffect(() => {

        async function fetchUserInfo() {
            try {
                var response = await authClient.get(`${baseURL()}api/user/userinfo`);

                var userInfo = response.data as UserInfo;

                setUserInfo(userInfo);
            }
            catch (error) {
                setUserInfo(initalUserInfo);
            }
        }

        fetchLoginInfo();
        fetchUserInfo();
    }, [])

    async function fetchLoginInfo() {
        try {
            var response = await authClient.get(`${baseURL()}api/user/logins`);

            var loginInfo = response.data as LoginInfo[];

            setLoginInfo(loginInfo);
        }
        catch (error) {
            setLoginInfo([]);
        }
    }

    function getBrowserImage(browser: string) {
        browser = browser.toLocaleLowerCase();
        if (browser.includes('firefox')) {
            return <FontAwesomeIcon icon={["fab", "firefox-browser"]} size="lg" />
        }
        else if (browser.includes('chrome')) {
            return <FontAwesomeIcon icon={["fab", "chrome"]} size="lg" />
        }
        else if (browser.includes('edge')) {
            return <FontAwesomeIcon icon={["fas", "edge"]} size="lg" />
        }
        else {
            return <FontAwesomeIcon icon={["fas", "browser"]} size="lg" />
        }
    }

    async function deleteAllSessions() {
        try {
            var response = await authClient.delete(`${baseURL()}api/user/revoke-all`);
            setLoginInfo([]);
            await logout();
            navigate('');
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                notification.error(t('deleteAllSessions'), 'top-center');
            }
        }
    }

    async function deleteSession(sessionId: string, sessionToken: string) {
        try {
            var response = await authClient.delete(`${baseURL()}api/user/revoke/${sessionId}`);
            setLoginInfo(loginInfo.filter((session) => {
                return session.id !== sessionId;
            }));

            if (sessionToken == user.refreshToken) {
                await logout();
                navigate('');
            }
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                notification.error(t('deleteSession'), 'top-center');
            }
        }
    }

    return (
        <div>
            <div className="mx-1 md:ml-5 md:mr-0 space-y-2">
                <h1 className="text-black dark:text-white font-bold mb-5">{t('profile')}</h1>
                <div className="p-3 bg-lightBackground dark:bg-gray-700 rounded-lg shadow-lg">
                    <h1 className=" text-black dark:text-white font-bold">{t('profileData')}</h1>

                    <ProfileDataItem>
                        <ProfileDataItem.Icon>
                            <FontAwesomeIcon icon={["fas", "user"]} size="lg" />
                        </ProfileDataItem.Icon>
                        <ProfileDataItem.Content>
                            <h1>{t('name')}</h1>
                            <label>
                                <span>{userInfo.firstName}</span>
                                <span>{userInfo.lastName}</span>
                            </label>
                        </ProfileDataItem.Content>
                        <ProfileDataItem.Edit>
                            <ChangeName userInfo={userInfo} setUserInfo={setUserInfo} />
                        </ProfileDataItem.Edit>
                    </ProfileDataItem>

                    <Line />

                    <ProfileDataItem>
                        <ProfileDataItem.Icon>
                            <FontAwesomeIcon icon={["fas", "envelope"]} size="lg" />
                        </ProfileDataItem.Icon>
                        <ProfileDataItem.Content>
                            <h1>Email</h1>
                            <label>{userInfo.email}</label>
                        </ProfileDataItem.Content>
                        <ProfileDataItem.Edit>
                            <ChangeEmail userInfo={userInfo} setUserInfo={setUserInfo} />
                        </ProfileDataItem.Edit>
                    </ProfileDataItem>

                    <Line />

                    <ProfileDataItem>
                        <ProfileDataItem.Icon>
                            <FontAwesomeIcon icon={["fas", "lock"]} size="lg" />
                        </ProfileDataItem.Icon>
                        <ProfileDataItem.Content>
                            <h1>{t('password')}</h1>
                            <label>********</label>
                        </ProfileDataItem.Content>
                        <ProfileDataItem.Edit>
                            <ChangePassword refreshLogins={fetchLoginInfo} />
                        </ProfileDataItem.Edit>
                    </ProfileDataItem>
                </div>

                <div className="p-3 bg-lightBackground dark:bg-gray-700 rounded-lg shadow-lg">
                    <h1>{t('devices')}</h1>
                    <div className="flex w-full md:w-1/3">
                        <BlackWhiteButton onClick={deleteAllSessions}>{t('exitAllDevices')}</BlackWhiteButton>
                    </div>
                    <div className="py-3 flex flex-wrap gap-3">

                        {loginInfo.map((item, key) => {
                            return (
                                <div key={key} className="flex p-1 border-2 rounded-lg w-40">
                                    <div>
                                        {getBrowserImage(item.deviceType)}
                                    </div>
                                    <div>
                                        {item.deviceType}
                                    </div>
                                    <div className="ml-auto">
                                        <FontAwesomeIcon icon={["fas", "x"]} className="text-red-600 cursor-pointer"
                                            onClick={() => deleteSession(item.id, item.token)} />
                                    </div>
                                </div>)
                        })}
                    </div>
                </div>
            </div>

        </div>
    )
}

function Line() {

    return (
        <div className="border-b-2"></div>
    )
}

function ProfileDataItem(props: any) {

    return (
        <>
            <div className="md:grid md:grid-cols-5 space-y-1 md:space-y-0 py-5">
                <div className="flex col-span-2 items-center md:grid md:grid-cols-2">
                    <div className="mr-2 md:justify-self-center">
                        {props.children[0]}
                    </div>
                    <div>
                        {props.children[1]}
                    </div>
                </div>
                <div className="col-start-4 col-span-2 lg:col-start-5 lg:col-span-1 grid w-full justify-self-end items-center">
                    {props.children[2]}
                </div>
            </div>
        </>
    )
}

function Icon(props: any) {

    return (
        <>
            {props.children}
        </>
    )
}

function Content(props: any) {

    return (
        <>
            {props.children}
        </>
    )
}

function Edit(props: any) {

    return (
        <>
            {props.children}
        </>
    )
}

ProfileDataItem.Icon = Icon;
ProfileDataItem.Content = Content;
ProfileDataItem.Edit = Edit;