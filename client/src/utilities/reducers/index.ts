import {
    IRegistration, IRegistrationAction, IRegistrationValidation, IRegistrationValidationAction,
    IRegistrationValidationState, IRegistrationValidationVisible, RegistrationActionType,
    RegistrationValidationActionType, registrationReducer, registrationValidationReducer, initialState, initialValidationState
} from './signUpReducers'

export {
    RegistrationActionType, RegistrationValidationActionType,
    registrationReducer, registrationValidationReducer,
    initialState, initialValidationState
}
export type {
    IRegistration, IRegistrationAction, IRegistrationValidation,
    IRegistrationValidationAction, IRegistrationValidationState, IRegistrationValidationVisible
}
