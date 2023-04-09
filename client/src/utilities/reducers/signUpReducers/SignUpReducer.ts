import { SignUpModel } from "../../authentication"

export enum RegistrationActionType {
    UPDATE_REGISTER_MODEL = 'UPDATE_REGISTER_MODEL',
    UPDATE = 'UPDATE'
}

export interface IRegistrationAction {
    type: RegistrationActionType,
    key: string,
    value: string
  }

export interface IRegistration {
    registerModel: SignUpModel
    confirmPassword: string,
}


export function registrationReducer(state: IRegistration, action: IRegistrationAction) {
    switch (action.type) {
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