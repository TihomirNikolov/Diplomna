import { RegistrationActionType, IRegistration, IRegistrationAction, registrationReducer } from "./SignUpReducer";
import { RegistrationValidationActionType, IRegistrationValidation, IRegistrationValidationAction, IRegistrationValidationState, IRegistrationValidationVisible, registrationValidationReducer } from "./SignUpValidationReducer";

export {
    RegistrationActionType, RegistrationValidationActionType,
    registrationReducer, registrationValidationReducer
};
export type {
    IRegistration, IRegistrationAction, IRegistrationValidation,
    IRegistrationValidationAction, IRegistrationValidationState, IRegistrationValidationVisible
};
