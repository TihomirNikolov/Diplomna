import validator from "validator";

export function validateEmail(email: string) {
    return email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) !== null;
}

export function validatePassword(password: string) {
    return password.match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/) !== null;
}

export function validateFirstName(value: string) {
    return value.match(/^[\p{L}'][ \p{L}'-]*[\p{L}]$/u) !== null;
}

export function validateLastName(value: string) {
    return value.match(/^[\p{L}'][ \p{L}'-]*[\p{L}]$/u) !== null;
}

export function validateMobileNumber(value: string) {
    return validator.isMobilePhone(value, 'bg-BG')
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

export function validateCardNumber(value: string) {
    return validator.isCreditCard(value);
}

export function validateCardholderName(value: string) {
    return value.match(/^[\w'\-,.][^0-9_!¡?÷?¿\/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/) !== null;
}

export function validateCardExpiry(value: string) {
    return value.match(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/) !== null;
}

export function validateCVV(value: string) {
    return value.match(/^[0-9]{3,4}$/) !== null;
}