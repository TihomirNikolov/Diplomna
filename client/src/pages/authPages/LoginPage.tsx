import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useRef, useState } from "react";
import { BlueButton, Checkbox, FloatingInput, LinkButton, useTitle } from "../../components";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { LoginModel, LoginResponse, axiosClient, baseURL, notification, setTokenObject, validateEmail } from "../../utilities";
import { User, useUser } from "../../contexts";
import { useNavigate } from "react-router-dom";

import './css/LoginPage.css'
import { FloatingInputHandle } from "../../components/inputs/FloatingInput";

export default function LoginPage() {
    const { t } = useTranslation();
    useTitle(t('title.login'));

    const emailInput = useRef<FloatingInputHandle>(null);
    const passwordInput = useRef<FloatingInputHandle>(null);
    const [rememberMe, setRememberMe] = useState<boolean>(false);


    const { setUser, setRoles, setIsEmailConfirmed } = useUser();
    const navigate = useNavigate();

    function onChecked() {
        setRememberMe(!rememberMe);
    }

    function validatePassword(value: string) {
        return value.length >= 8;
    }

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!emailInput.current?.isValid || !passwordInput.current?.isValid) {
            emailInput.current?.showValidation();
            passwordInput.current?.showValidation();
            return;
        }

        let login: LoginModel = { email: emailInput.current.value, password: passwordInput.current.value, rememberMe }
        try {
            var response = await axiosClient.post(`${baseURL()}api/authenticate/login`, login);

            let data = response.data as LoginResponse;

            var user: User = {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken
            }
            setTokenObject(user);
            setIsEmailConfirmed(data.isEmailConfirmed);
            setRoles(data.roles);
            setUser(user);
            navigate('/home');
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                if(error.response?.status == 403){
                    notification.error(t('responseErrors.loginError'), "top-center");
                }
                else{
                    notification.error(t('responseErrors.serverError'), 'top-center')
                }
            }
        }
    }

    return (
        <div className="grid h-[calc(100vh-50px)] place-items-center">
            <div className="space-y-5 mx-4 w-auto md:w-96">
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
                    <FloatingInput ref={emailInput}
                        inputId="floating_outlined_1"
                        placeholder="E-mail"
                        type="email"
                        validate={validateEmail} immediateValdation={true}
                        validationMessage={t('errorInput.emailInvalid')!} />
                    <div>
                        <FloatingInput ref={passwordInput}
                            inputId="floating_outlined_2"
                            placeholder={t('password')}
                            type="password" isPassword={true}
                            validate={validatePassword} immediateValdation={true}
                            validationMessage={t('errorInput.eightCharactersRequired')!} />
                        <div className="grid place-items-end">
                            <LinkButton link="/forgotpassword" text={t('forgottenPassword')} />
                        </div>
                    </div>
                    <Checkbox id="rememberMe"
                        checked={rememberMe}
                        onChange={onChecked}
                        labelText={t('rememberMe')!} />
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