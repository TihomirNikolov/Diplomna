import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useRef, useState } from "react";
import { BlueButton, Checkbox, FloatingInput, LinkButton, useTitle } from "../../components";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { LoginModel, LoginResponse, authClient, axiosClient, baseShoppingCartURL, baseUserURL, notification, setTokenObject, validateEmail } from "../../utilities";
import { User, useShoppingCart, useUser } from "../../contexts";
import { useNavigate } from "react-router-dom";
import { FloatingInputHandle } from "../../components/inputs/FloatingInput";

export default function LoginPage() {
    const { t } = useTranslation();
    useTitle(t('title.login'));

    const emailInput = useRef<FloatingInputHandle>(null);
    const passwordInput = useRef<FloatingInputHandle>(null);
    const [rememberMe, setRememberMe] = useState<boolean>(false);

    const { setUser, setRoles, setIsEmailConfirmed, setIsAuthenticated } = useUser();
    const { merge } = useShoppingCart();

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
            var response = await axiosClient.post(`${baseUserURL()}api/authenticate/login`, login);

            let data = response.data as LoginResponse;

            var user: User = {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken
            }
            setTokenObject(user);
            setIsEmailConfirmed(data.isEmailConfirmed);
            setRoles(data.roles);
            setUser(user);
            merge();
            setIsAuthenticated(true);
            navigate('/home');
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status == 403) {
                    notification.error(t('responseErrors.loginError'), "top-center");
                }
                else {
                    notification.error(t('responseErrors.serverError'), 'top-center')
                }
            }
            setIsAuthenticated(false);
        }
    }

    return (
        <div className="grid h-[calc(100vh-50px)] place-items-center">
            <div className="space-y-5 mx-4 w-auto md:w-96">
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