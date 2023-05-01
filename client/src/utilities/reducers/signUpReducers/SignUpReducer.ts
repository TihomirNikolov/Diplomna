import { IRegistration } from "."
import { SignUpModel } from "../../authentication"

export enum RegistrationActionType {
    UPDATE_REGISTER_MODEL = "UPDATE_REGISTER_MODEL",
    UPDATE = "UPDATE",
    RESET = "RESET"
}

export interface RegistrationAction {
    type: RegistrationActionType,
    key: string,
    value: string
  }

export interface Registration {
    registerModel: SignUpModel
    confirmPassword: string,
}

export const initialState: IRegistration = {
    confirmPassword: '',
    registerModel: {
        email: '',
        password: '',
    }
}

export function registrationReducer(state: Registration, action: RegistrationAction) {
    switch (action.type) {
        case 'RESET':
            return initialState;
        case 'UPDATE':
            return {
                ...state,
                [action.key]: action.value,
            }
        case 'UPDATE_REGISTER_MODEL':
            return{
                ...state,
                registerModel: {
                    ...state.registerModel,
                    [action.key]: action.value,
                }
            }
        default:
            return state
    }
}