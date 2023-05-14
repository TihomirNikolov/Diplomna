import { User } from "../../contexts";

export function getRefreshToken() {
    var tokenModel: User = JSON.parse(localStorage.getItem("user")!);
    return tokenModel.refreshToken;
}

export function getAccessToken() {
    var tokenModel: User = JSON.parse(localStorage.getItem("user")!);
    return tokenModel.accessToken;
}

export function getTokenObject() {
    return JSON.parse(localStorage.getItem("user")!) as User;

}

export function setRefreshToken(refreshToken: string) {
    var oldToken: User = getTokenObject();
    oldToken.refreshToken = refreshToken;
    localStorage.setItem('user', JSON.stringify(oldToken));
}

export function setAccessToken(accessToken: string) {
    var oldToken: User = getTokenObject();
    oldToken.accessToken = accessToken;
    localStorage.setItem('user', JSON.stringify(oldToken));
}

export function setTokenObject(tokenModel: User) {
    localStorage.setItem('user', JSON.stringify({ accessToken: tokenModel.accessToken, refreshToken: tokenModel.refreshToken }))
}

export function removeTokenObject(){
    localStorage.removeItem('user');
}