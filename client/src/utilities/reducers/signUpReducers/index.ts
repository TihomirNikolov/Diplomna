import { RegistrationActionType, Registration, RegistrationAction, registrationReducer, initialState } from "./SignUpReducer";
import { RegistrationValidationActionType, IRegistrationValidation, IRegistrationValidationAction, IRegistrationValidationState, IRegistrationValidationVisible, registrationValidationReducer, initialValidationState } from "./SignUpValidationReducer";

export {
    RegistrationActionType, RegistrationValidationActionType,
    registrationReducer, registrationValidationReducer, initialState, initialValidationState
};
export type {
    Registration as IRegistration, RegistrationAction as IRegistrationAction, IRegistrationValidation,
    IRegistrationValidationAction, IRegistrationValidationState, IRegistrationValidationVisible
};
