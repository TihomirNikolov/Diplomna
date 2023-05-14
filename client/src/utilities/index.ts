import { LoginResponse, LoginModel, SignUpModel } from './authentication';
import classNames from './ConditionalClassNames'
import { baseURL } from './urls';
import { notification } from './toasts';
import { authClient, axiosClient } from './axiosClients';
import {
    getAccessToken, getRefreshToken, getTokenObject,
    setAccessToken, setRefreshToken, setTokenObject, removeTokenObject
} from './services';
import {
    validateEmail, validatePassword, validateCity, validateFirstName,
    validateLastName, validateMobileNumber, validateStreetAddress,
    validateRegion
} from './validations';
import { UserInfo, LoginInfo, Address } from './models';

export {
    classNames, baseURL, notification, authClient, axiosClient,
    getAccessToken, getRefreshToken, getTokenObject, setAccessToken, setRefreshToken, setTokenObject, removeTokenObject,
    validateEmail, validatePassword, validateCity, validateFirstName,
    validateLastName, validateMobileNumber, validateStreetAddress,
    validateRegion
};
export type {
    LoginResponse, LoginModel, SignUpModel,
    UserInfo, LoginInfo, Address
};
