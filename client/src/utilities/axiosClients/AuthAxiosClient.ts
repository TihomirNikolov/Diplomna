import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { baseURL } from "../urls";
import { getAccessToken, getRefreshToken, setRefreshToken, setTokenObject } from "../services";
import { TokenModel } from "../authentication";


const authClient = axios.create();

authClient.interceptors.request.use(
    (config) => {
        config.headers['Authorization'] = 'Bearer ' + getAccessToken();
        return config;
    });

authClient.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (error.response.status === 401) {
            return ResetTokenAndReattemptRequest(error);
        } else {
            console.error(error);
        }
        return Promise.reject(error);
    }
);

export default authClient;

let isAlreadyFetchingAccessToken = false;

let subscribers: any[] = [];

export async function ResetTokenAndReattemptRequest(error: any) {
    try {
        const { response: errorResponse } = error;
        const retryOriginalRequest = new Promise((resolve) => {
            addSubscriber((access_token: any) => {
                errorResponse.config.headers.Authorization = "Bearer " + access_token;
                resolve(axios(errorResponse.config));
            });
        });
        if (!isAlreadyFetchingAccessToken) {
            isAlreadyFetchingAccessToken = true;
            await axios.post(`${baseURL()}api/authenticate/refresh-token`, { refreshToken: getRefreshToken() })
                .then(function (response) {
                    var data = response.data as TokenModel;
                    setTokenObject({ accessToken: data.accessToken, refreshToken: data.refreshToken, isEmailConfirmed: data.isEmailConfirmed, role: "user" })
                })
                .catch(function (error) {
                    return Promise.reject(error);
                });
            isAlreadyFetchingAccessToken = false;
            onAccessTokenFetched(getAccessToken());
        }
        return retryOriginalRequest;
    } catch (err) {
        return Promise.reject(err);
    }
}

function onAccessTokenFetched(access_token: any) {
    subscribers.forEach((callback) => callback(access_token));
    subscribers = [];
}

function addSubscriber(callback: any) {
    subscribers.push(callback);
}