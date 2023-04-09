
export enum RegistrationValidationActionType {
    EMAIL_VALIDATION = "EMAIL_VALIDATION",
    PASSWORD_VALIDATION = "PASSWORD_VALIDATION",
    CONFIRM_PASSWORD_VALIDATION = "CONFIRM_PASSWORD_VALIDATION",
    FIRST_NAME_VALIDATION = "FIRST_NAME_VALIDATION",
    LAST_NAME_VALIDATION = "LAST_NAME_VALIDATION"
}

export interface IRegistrationValidationAction {
    type: RegistrationValidationActionType,
    value: string
}

export interface IRegistrationValidation {
    isEmailValid: boolean,
    isPasswordValid: boolean,
    isConfirmPasswordValid: boolean,
    isFirstNameValid: boolean,
    isLastNameValid: boolean
}

export interface IRegistrationValidationVisible {
    isEmailValidVisible: boolean,
    isPasswordValidVisible: boolean,
    isConfirmPasswordValidVisible: boolean,
    isFirstNameValidVisible: boolean,
    isLastNameValidVisible: boolean,
}

export interface IRegistrationValidationState {
    validation: IRegistrationValidation,
    validationVisible: IRegistrationValidationVisible
}

export function registrationValidationReducer(state: IRegistrationValidationState, action: IRegistrationValidationAction) {
    switch (action.type) {
        case 'EMAIL_VALIDATION':
            if (action.value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                state.validation.isEmailValid = true;
            }
            else {
                state.validation.isEmailValid = false;
            }
            state.validationVisible.isEmailValidVisible = true;
            return {
                ...state
            }
        case 'PASSWORD_VALIDATION':
            if (action.value.match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)) {
                state.validation.isPasswordValid = true;
            }
            else {
                state.validation.isPasswordValid = false;
            }
            state.validationVisible.isPasswordValidVisible = true;
            return {
                ...state
            }
            case 'CONFIRM_PASSWORD_VALIDATION':{
                state.validationVisible.isConfirmPasswordValidVisible = action.value === "true";
                return {
                    ...state
                }
            }
        case 'FIRST_NAME_VALIDATION':
            if (action.value.length > 1) {
                state.validation.isFirstNameValid = true;
            }
            else {
                state.validation.isFirstNameValid = false;
            }
            state.validationVisible.isFirstNameValidVisible = true;
            return {
                ...state
            }
        case 'LAST_NAME_VALIDATION':
            if (action.value.length > 1) {
                state.validation.isLastNameValid = true;
            }
            else {
                state.validation.isLastNameValid = false;
            }
            state.validationVisible.isLastNameValidVisible = true;
            return {
                ...state
            }
        default:
            return {
                ...state
            }
    }
}