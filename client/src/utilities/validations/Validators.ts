import validator from "validator";

export function validateEmail(email: string) {
    return email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) !== null;
}

export function validatePassword(password: string) {
    return password.match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/) !== null;
}

export function validateFirstName(value: string) {
    return value.length >= 3;
}

export function validateLastName(value: string) {
    return value.length >= 3;
}

export function validateMobileNumber(value: string) {
    return validator.isMobilePhone(value)
}

export function validateStreetAddress(value: string) {
    return value.length >= 5;
}

export function validateRegion(value: string) {
    return value.length >= 2;
}

export function validateCity(value: string) {
    return value.length >= 2;
}

export function validateTitle(value: string) {
    return value.length >= 3;
}

export function validateComment(value: string) {
    return value.length >= 3;
}