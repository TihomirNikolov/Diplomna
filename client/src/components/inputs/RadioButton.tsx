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
        <div>
            <input type="radio" name={props.radioGroup} id={props.id}
                className={`w-4 h-4 ${props.inputClass ?? props.inputClass}`}
                checked={props.checked} onChange={props.onChange} value={props.value} />
            <label htmlFor={`${props.id}`} className={`${props.labelClass ?? props.labelClass}`}>{props.labelText}</label>
        </div>
    )
}