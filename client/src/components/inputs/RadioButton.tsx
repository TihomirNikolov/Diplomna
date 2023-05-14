import { ChangeEventHandler } from "react"

interface Props {
    labelText: string,
    radioGroup: string,
    id: string,
    checked: boolean,
    value: string,
    onChange: ChangeEventHandler<HTMLInputElement>,
    inputClass?: string,
    labelClass?: string
}

export default function RadioButton(props: Props) {

    return (
        <div className="flex items-center">
            <input type="radio" name={props.radioGroup} id={props.id}
                className={`w-4 h-4 text-orange-500 checked:bg-orange-500 focus:ring-0 focus:ring-offset-0
                ${props.inputClass ?? props.inputClass}`}
                checked={props.checked} onChange={props.onChange} value={props.value} />
            <label htmlFor={`${props.id}`} className={`pl-1 text-black dark:text-white ${props.labelClass ?? props.labelClass}`}>{props.labelText}</label>
        </div>
    )
}