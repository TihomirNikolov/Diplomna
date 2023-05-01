import { validateEmail, validatePassword } from "../..";

export enum RegistrationValidationActionType {
    EMAIL_VALIDATION = "EMAIL_VALIDATION",
    PASSWORD_VALIDATION = "PASSWORD_VALIDATION",
    CONFIRM_PASSWORD_VALIDATION = "CONFIRM_PASSWORD_VALIDATION",
    RESET = "RESET"
}

export interface IRegistrationValidationAction {
    type: RegistrationValidationActionType,
    value: string
}

export interface IRegistrationValidation {
    isEmailValid: boolean,
    isPasswordValid: boolean,
    isConfirmPasswordValid: boolean
}

export interface IRegistrationValidationVisible {
    isEmailValidVisible: boolean,
    isPasswordValidVisible: boolean,
    isConfirmPasswordValidVisible: boolean
}

export interface IRegistrationValidationState {
    validation: IRegistrationValidation,
    validationVisible: IRegistrationValidationVisible
}


const initialValidation: IRegistrationValidation = {
    isEmailValid: false,
    isPasswordValid: false,
    isConfirmPasswordValid: false
}

const initialValidationVisible: IRegistrationValidationVisible = {
    isEmailValidVisible: false,
    isPasswordValidVisible: false,
    isConfirmPasswordValidVisible: false
}

export const initialValidationState: IRegistrationValidationState = {
    validation: initialValidation,
    validationVisible: initialValidationVisible
}

export function registrationValidationReducer(state: IRegistrationValidationState, action: IRegistrationValidationAction) {
    switch (action.type) {
        case 'RESET':
            return initialValidationState;
        case 'EMAIL_VALIDATION':
            if (validateEmail(action.value)) {
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
            if (validatePassword(action.value)) {
                state.validation.isPasswordValid = true;
            }
            else {
                state.validation.isPasswordValid = false;
            }
            state.validationVisible.isPasswordValidVisible = true;
            return {
                ...state
            }
        case 'CONFIRM_PASSWORD_VALIDATION': {
            state.validationVisible.isConfirmPasswordValidVisible = action.value === "true";
            return {
                ...state
            }
        }
        default:
            return {
                ...state
            }
    }
}