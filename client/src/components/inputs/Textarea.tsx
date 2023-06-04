import { forwardRef, useEffect, useState, useImperativeHandle } from "react"
import { useTranslation } from "react-i18next"

interface Props {
    placeholder: string,
    initialValue?: string,
    validate?: (value: string) => boolean,
    validateOnLostFocus?: boolean,
    immediateValdation?: boolean,
    validationMessage?: string,
    className?: string
}

export type TextareaHandle = {
    showValidation: () => void,
    value: string,
    isValid: boolean
}

const Textarea = forwardRef<TextareaHandle, Props>((props: Props, ref) => {
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

    function onChange(value: string) {
        setValue(value);
        if (props.immediateValdation) {
            validate(value);
            setIsValidationVisible(true);
        }
    }

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

    function onLostFocus(value: string) {
        if ((props.validateOnLostFocus || value.length == 0) && props.validate !== undefined) {
            validate(value);
            setIsValidationVisible(true);
        }
    }

    function setValidationVisible() {
        validate(value);
        setIsValidationVisible(true);
    }

    return (
        <div className="flex flex-col gap-1">
            <label className={`${isValidationVisible ? (isValid ? 'text-green-500'
                : 'text-red-500') : 'text-gray-500 dark:text-gray-400'}`}>
                {props.placeholder}
            </label>
            <textarea className={`rounded-lg border-2 bg-transparent focus:ring-0 text-gray-800 dark:text-white
                 ${isValidationVisible ? (isValid ? 'border-green-500 dark:border-green-500'
                    : 'border-red-500 dark:border-red-500') : 'border-gray-300  dark:border-gray-600'} ${props.className}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={(e) => onLostFocus(e.target.value)} />
            <label className={`text-red-500 ${props.validate !== undefined ?
                (isValidationVisible ? (isValid ? 'invisible' : '') : 'invisible') : 'hidden'}`}>
                {value.length == 0 ? t('errorInput.requiredField') : props.validationMessage}
            </label>
        </div>
    )
})


export default Textarea;