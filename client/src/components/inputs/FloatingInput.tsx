import { HTMLInputTypeAttribute, forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { useTranslation } from "react-i18next";
import { Tooltip } from "../utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
    inputId: string,
    placeholder: string,
    type: HTMLInputTypeAttribute,
    validate?: (value: string) => boolean,
    validateOnLostFocus?: boolean,
    immediateValdation?: boolean,
    validationMessage?: string,
    isPassword?: boolean,
    initialValue?: string,
    maxLength?: number
}

export type FloatingInputHandle = {
    showValidation: () => void,
    value: string,
    isValid: boolean
}

const FloatingInput = forwardRef<FloatingInputHandle, Props>((props: Props, ref) => {
    const { t } = useTranslation();
    const [value, setValue] = useState<string>('');
    const [isValid, setIsValid] = useState<boolean>(false);
    const [isValidationVisible, setIsValidationVisible] = useState<boolean>();

    useImperativeHandle(ref, () => ({
        showValidation() {
            setValidationVisible();
        },
        value: value,
        isValid: isValid
    }))

    useEffect(() => {
        if (props.initialValue != undefined) {
            setValue(props.initialValue);
            validate(props.initialValue);
        }
    }, [props.initialValue])

    function validate(value: string) {
        if (props.validate !== undefined) {
            if (props.validate(value)) {
                setIsValid(true);
            }
            else {
                setIsValid(false);
            }
        }
    }

    function onChange(value: string) {
        setValue(value);
        if (props.immediateValdation) {
            validate(value);
            setIsValidationVisible(true);
        }
    }

    function onLostFocus(value: string) {
        if (props.validateOnLostFocus || value.length == 0) {
            validate(value);
            setIsValidationVisible(true);
        }
    }

    function setValidationVisible() {
        validate(value);
        setIsValidationVisible(true);
    }

    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

    return (
        <div className="relative flex items-center w-full">
            <input type={props.isPassword ? (isPasswordVisible ? 'text' : props.type) : props.type}
                id={props.inputId}
                maxLength={props.maxLength}
                onChange={(e) => onChange(e.target.value)}
                onBlur={(e) => onLostFocus(e.target.value)} value={value}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-800 bg-transparent rounded-lg border-2  
                    appearance-none dark:text-white dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer
                    ${isValidationVisible ? (isValid ? 'border-green-500 dark:border-green-500' : 'border-red-500 dark:border-red-500') : 'border-gray-300  dark:border-gray-600'}`}
                placeholder=" " autoComplete="off" />
            <label htmlFor={props.inputId} className={`absolute text-sm bg-white dark:bg-gray-800 peer-focus:text-blue-600 peer-focus:dark:text-blue-500
            duration-300 transform -translate-y-4 scale-75 top-2 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 
            peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1
            ${isValidationVisible ? (isValid ? ' text-green-500 dark:text-green-400'
                    : ' text-red-500 dark:text-red-400') : ' text-gray-500 dark:text-gray-400'}`}>
                {props.placeholder}

            </label>
            {props.isPassword &&
                <i className={`far ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'} text-gray-800 dark:text-gray-300
                cursor-pointer absolute z-10 ${props.validate !== undefined ? 'right-8' : 'right-6'}  bottom-4`} id="togglePassword"
                    onClick={() => { setIsPasswordVisible(!isPasswordVisible) }} />
            }
            <div className={`${props.validate !== undefined ?
                (isValidationVisible ? (isValid ? 'invisible' : '') : 'invisible') : 'hidden'}`}>
                <Tooltip text={value.length == 0 ? t('errorInput.requiredField') : props.validationMessage!} position="right">
                    <FontAwesomeIcon data-tooltip-target="password-tooltip" icon={['fas', 'circle-info']} size="sm" className="ml-2 text-red-500 dark:text-red-400" />
                </Tooltip>
            </div>

        </div>
    )
})

export default FloatingInput;