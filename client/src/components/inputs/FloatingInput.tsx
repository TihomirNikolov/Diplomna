import { ChangeEventHandler, FocusEventHandler, HTMLInputTypeAttribute, useState } from "react"

interface IProps {
    placeholder: string,
    type: HTMLInputTypeAttribute,
    tabIndex: number,
    disabled?: boolean,
    readOnly?: boolean,
    value: string,
    onChange: ChangeEventHandler<HTMLInputElement>,
    onBlur?: FocusEventHandler<HTMLInputElement>,
    onFocus?: FocusEventHandler<HTMLInputElement>
    inputId: string,
    isValid?: boolean,
    isValidVisible?: boolean,
    isPassword?: boolean
}

export default function FloatingInput(props: IProps) {

    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

    return (
        <div className="relative">
            <input onChange={props.onChange} onBlur={props.onBlur} value={props.value} disabled={props.disabled}
                readOnly={props.readOnly} tabIndex={props.tabIndex} type={props.isPassword ? (isPasswordVisible ? 'text' : props.type) : props.type} id={props.inputId}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-800 bg-transparent rounded-lg border-2  
                    appearance-none dark:text-white dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer
                    ${props.isValidVisible ? (props.isValid ? 'border-green-500 dark:border-green-500' : 'border-red-500 dark:border-red-500') : 'border-gray-300  dark:border-gray-600'}`}
                placeholder=" " autoComplete="off" onFocus={props.onFocus} />
            <label htmlFor={props.inputId} className={`absolute text-sm bg-white dark:bg-gray-800  peer-focus:text-blue-600 peer-focus:dark:text-blue-500 
            duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 
            peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1
            ${props.isValidVisible ? (props.isValid ? ' text-green-500 dark:text-green-400'
                    : ' text-red-500 dark:text-red-400') : ' text-gray-500 dark:text-gray-400'}`}>
                {props.placeholder}
            </label>
            {props.isPassword &&
                <i className={`far ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'} text-gray-800 dark:text-gray-300
                cursor-pointer absolute z-10 right-2 bottom-4`} id="togglePassword"
                    onClick={() => { setIsPasswordVisible(!isPasswordVisible) }} />
            }
        </div>
    )
}