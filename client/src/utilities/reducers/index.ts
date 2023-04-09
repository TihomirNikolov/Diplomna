import {
    IRegistration, IRegistrationAction, IRegistrationValidation, IRegistrationValidationAction,
    IRegistrationValidationState, IRegistrationValidationVisible, RegistrationActionType,
    RegistrationValidationActionType, registrationReducer, registrationValidationReducer
} from './signUpReducers'

export { RegistrationActionType, RegistrationValidationActionType, registrationReducer, registrationValidationReducer }
export type {
    IRegistration, IRegistrationAction, IRegistrationValidation,
    IRegistrationValidationAction, IRegistrationValidationState, IRegistrationValidationVisible
}
