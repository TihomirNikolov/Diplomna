import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useState } from "react";
import { BlueButton, Checkbox, FloatingInput, LinkButton } from "../../components";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { LoginModel, TokenModel, axiosClient, baseURL, notification, setTokenObject, validateEmail } from "../../utilities";
import { User, useUser } from "../../contexts";
import { useNavigate } from "react-router-dom";

import './css/LoginPage.css'

export default function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
    const [isEmailValidationVisible, setIsEmailValidationVisible] = useState<boolean>(false);
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
    const [isPasswordValidationVisible, setIsPasswordValidationVisible] = useState<boolean>(false);

    const { t } = useTranslation();
    const { setUser, setRole, setIsEmailConfirmed } = useUser();
    const navigate = useNavigate();

    function onEmailChanged(value: string) {
        setEmail(value);
    }

    function onEmailLostFocus(email: string) {
        if (validateEmail(email)) {
            setIsEmailValid(true);
        } else {
            setIsEmailValid(false);
        }
        setIsEmailValidationVisible(true);
    }

    function onPasswordLostFocus(password: string) {
        if (validatePassword(password)) {
            setIsPasswordValid(true);
        } else {
            setIsPasswordValid(false);
        }
        setIsPasswordValidationVisible(true);
    }

    function validatePassword(password: string) {
        return password.length > 1;
    }

    function onPasswordChanged(value: string) {
        setPassword(value);
    }

    function onChecked() {
        setRememberMe(!rememberMe);
    }

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!validateEmail(email) || !validatePassword(password)) {
            setIsEmailValidationVisible(true);
            setIsPasswordValidationVisible(true);
            return;
        }

        let login: LoginModel = { email, password, rememberMe }
        try {
            var response = await axiosClient.post(`${baseURL()}api/authenticate/login`, login);

            let data = response.data as TokenModel;

            var user: User = {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken
            }
            setIsEmailConfirmed(data.isEmailConfirmed);
            setRole('user');
            setUser(user);
            navigate('/home');
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                notification.error(t('loginError'), "top-center");
            }
        }
    }

    return (
        <div className="grid h-[calc(100vh-50px)] place-items-center">
            <div className="space-y-5 mx-4 w-96">
                <button className="text-black w-full rounded-lg py-1 bg-white hover:bg-gray-200 shadow-lg" >
                    <i className="fab fa-google fa-1x"></i> <label className="hover:cursor-pointer">{t('loginGoogle')}</label>
                </button>
                <button className="text-white w-full rounded-lg py-1 bg-facebook hover:bg-facebookHover shadow-lg">
                    <FontAwesomeIcon icon={['fab', 'facebook']} /> <label className="hover:cursor-pointer">{t('loginFacebook')}</label>
                </button>
                <button className="text-white w-full rounded-lg py-1 bg-twitter hover:bg-twitterHover shadow-lg">
                    <FontAwesomeIcon icon={['fab', 'twitter']} /> <label className="hover:cursor-pointer">{t('loginTwitter')}</label>
                </button>
                <form className="p-6 space-y-5 bg-white dark:bg-gray-800 rounded-lg shadow-lg" onSubmit={e => onSubmit(e)} >
                    <h1 className="text-xl font-bold text-black dark:text-gray-500">{t('signIn')}</h1>
                    <FloatingInput inputId="floating_outlined_1" placeholder="E-mail" tabIndex={1} disabled={false}
                        readOnly={false} type="text" value={email}
                        onChange={(e) => onEmailChanged(e.target.value)}
                        onBlur={(e) => onEmailLostFocus(e.target.value)}
                        isValid={isEmailValid}
                        isValidVisible={isEmailValidationVisible} />
                    <div>
                        <FloatingInput inputId="floating_outlined_2" placeholder={t('password')} tabIndex={2} disabled={false}
                            readOnly={false} type="password" value={password}
                            onChange={(e) => onPasswordChanged(e.target.value)}
                            onBlur={(e) => onPasswordLostFocus(e.target.value)}
                            isValid={isPasswordValid} isPassword={true}
                            isValidVisible={isPasswordValidationVisible} />
                        <div className="grid place-items-end">
                            <LinkButton link="/forgotpassword" text={t('forgottenPassword')} />
                        </div>
                    </div>
                    <Checkbox id="rememberMe"
                        checked={rememberMe}
                        onChange={onChecked}
                        labelText={t('rememberMe') ?? ''} />
                    <div className="space-y-1">
                        <BlueButton>{t('signIn')}</BlueButton>
                        <div className="grid place-items-end">
                            <label className="text-sm dark: text-gray-500">{t('dontHaveAccount')}<LinkButton link="/register" text={t('signUp')} /></label>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}