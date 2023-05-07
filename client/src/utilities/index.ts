import { TokenModel, LoginModel, SignUpModel } from './authentication';
import {
    RegistrationActionType, IRegistrationAction, IRegistration, registrationReducer,
    RegistrationValidationActionType, IRegistrationValidationAction,
    IRegistrationValidation, registrationValidationReducer, IRegistrationValidationVisible, IRegistrationValidationState,
    initialState, initialValidationState
} from './reducers'
import classNames from './ConditionalClassNames'
import { baseURL } from './urls';
import { notification } from './toasts';
import { authClient, axiosClient } from './axiosClients';
import {
    getAccessToken, getRefreshToken, getTokenObject,
    setAccessToken, setRefreshToken, setTokenObject, removeTokenObject
} from './services';
import { validateEmail, validatePassword } from './validations';
import { UserInfo, LoginInfo } from './models';

export {
    RegistrationActionType, registrationReducer, RegistrationValidationActionType,
    registrationValidationReducer, initialState, initialValidationState,
    classNames, baseURL, notification, authClient, axiosClient,
    getAccessToken, getRefreshToken, getTokenObject, setAccessToken, setRefreshToken, setTokenObject, removeTokenObject,
    validateEmail, validatePassword
};
export type {
    IRegistrationAction, IRegistrationValidationAction, IRegistration, IRegistrationValidation,
    IRegistrationValidationVisible, IRegistrationValidationState, TokenModel, LoginModel, SignUpModel,
    UserInfo, LoginInfo
};
