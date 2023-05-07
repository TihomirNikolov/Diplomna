import { User } from "../../contexts";

interface LocalStorageToken {
    refreshToken: string;
    accessToken: string;
};

export function getRefreshToken() {
    var tokenModel: LocalStorageToken = JSON.parse(localStorage.getItem("user")!);
    return tokenModel.refreshToken;
}

export function getAccessToken() {
    var tokenModel: LocalStorageToken = JSON.parse(localStorage.getItem("user")!);
    return tokenModel.accessToken;
}

export function getTokenObject() {
    return JSON.parse(localStorage.getItem("user")!) as LocalStorageToken;

}

export function setRefreshToken(refreshToken: string) {
    var oldToken: LocalStorageToken = getTokenObject();
    oldToken.refreshToken = refreshToken;
    localStorage.setItem('user', JSON.stringify(oldToken));
}

export function setAccessToken(accessToken: string) {
    var oldToken: LocalStorageToken = getTokenObject();
    oldToken.accessToken = accessToken;
    localStorage.setItem('user', JSON.stringify(oldToken));
}

export function setTokenObject(tokenModel: User) {
    localStorage.setItem('user', JSON.stringify({ accessToken: tokenModel.accessToken, refreshToken: tokenModel.refreshToken }))
}

export function removeTokenObject(){
    localStorage.removeItem('user');
}