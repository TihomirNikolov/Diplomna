import { useEffect, useState } from "react";
import { LoginInfo, UserInfo, authClient, baseUserURL, notification } from "../../utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BlackWhiteButton, ChangeEmail, ChangeName, ChangePassword, DeleteAccount, Input, Modal, Tooltip, useTitle } from "../../components";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useUser } from "../../contexts";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const initalUserInfo: UserInfo = {
    email: '',
    firstName: '',
    lastName: ''
}

export default function AccountPage() {
    const { t } = useTranslation();
    useTitle(t('title.account'));

    const [loginInfo, setLoginInfo] = useState<LoginInfo[]>([])
    const [userInfo, setUserInfo] = useState<UserInfo>(initalUserInfo);

    const { user, logout } = useUser();

    const navigate = useNavigate();

    useEffect(() => {

        async function fetchUserInfo() {
            try {
                var response = await authClient.get(`${baseUserURL()}api/user/userinfo`);

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
            var response = await authClient.get(`${baseUserURL()}api/user/logins`);

            var loginInfo = response.data as LoginInfo[];
            loginInfo.forEach(l => {
                l.createdTime = new Date(l.createdTime);
            })
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
            return <FontAwesomeIcon icon={["fab", "edge"]} size="lg" />
        }
        else if (browser.includes('safari')) {
            return <FontAwesomeIcon icon={["fab", "safari"]} size="lg" />
        }
        else {
            return <FontAwesomeIcon icon={["fas", "browser"]} size="lg" />
        }
    }

    async function deleteAllSessions() {
        try {
            var response = await authClient.delete(`${baseUserURL()}api/user/revoke-all`);
            setLoginInfo([]);
            await logout();
            navigate('');
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                notification.error(t('responseErrors.deleteAllSessions'), 'top-center');
            }
        }
    }

    async function deleteSession(sessionId: string, sessionToken: string) {
        try {
            var response = await authClient.delete(`${baseUserURL()}api/user/revoke/${sessionId}`);
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
                notification.error(t('responseErrors.deleteSession'), 'top-center');
            }
        }
    }

    return (
        <div>
            <div className="mx-1 md:ml-0 md:mr-0 space-y-2 mb-2 md:mb-0">
                <h1 className="text-black dark:text-white font-bold mb-5 text-2xl">{t('profile')}</h1>
                <div className="p-3 bg-lightBackground dark:bg-gray-700 rounded-lg shadow-lg">
                    <h1 className="text-black dark:text-white font-bold text-2xl">{t('profileData')}</h1>
                    <ProfileDataItem>
                        <ProfileDataItem.Icon>
                            <FontAwesomeIcon icon={["fas", "user"]} size="lg" />
                        </ProfileDataItem.Icon>
                        <ProfileDataItem.Content>
                            <h1>{t('name')}</h1>
                            <label>
                                <span>{userInfo.firstName}&nbsp;</span>
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
                        {/* <ProfileDataItem.Edit>
                            <ChangeEmail userInfo={userInfo} setUserInfo={setUserInfo} />
                        </ProfileDataItem.Edit> */}
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

                <div className="flex flex-col gap-2 p-3 bg-lightBackground dark:bg-gray-700 rounded-lg shadow-lg">
                    <h1 className="font-bold text-2xl">{t('devices')}</h1>
                    <div className="flex w-full md:w-1/3">
                        <BlackWhiteButton className="w-full" onClick={deleteAllSessions}>{t('exitAllDevices')}</BlackWhiteButton>
                    </div>
                    <div className="py-3 flex flex-wrap gap-3">

                        {loginInfo.map((item, key) => {
                            return (
                                <div key={key} className="flex flex-col p-1 border-2 rounded-lg w-full sm:w-64">
                                    <div className="flex p-1">
                                        <div>
                                            {getBrowserImage(item.deviceType)}
                                        </div>
                                        <div className="truncate ml-1">
                                            {item.deviceType}
                                        </div>
                                        <div className="ml-auto px-1 hover:bg-gray-300 hover:dark:bg-gray-500 cursor-pointer">
                                            <FontAwesomeIcon icon={["fas", "x"]} className="text-red-600"
                                                onClick={() => deleteSession(item.id, item.token)} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex">
                                            {t('loggedInOn')}&nbsp;
                                            {moment(item.createdTime).format("DD-MM-YYYY HH:mm:ss")}
                                        </div>
                                    </div>
                                </div>)
                        })}
                    </div>
                </div>
                <div className="flex flex-col gap-3 p-3 bg-lightBackground dark:bg-gray-700 rounded-lg shadow-lg">
                    <h1 className="font-bold text-2xl text-red-600">{t('deleteAccount')}</h1>
                    <span>{t('deleteWarning')}</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                        <DeleteAccount />
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