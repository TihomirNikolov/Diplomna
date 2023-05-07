interface Props {
    checked: boolean,
    onChange: () => void,
    labelText?: string,
    id: string
}

export default function Checkbox(props: Props) {

    return (
        <div>
            <input id={props.id} type="checkbox" checked={props.checked} readOnly={true} onChange={() => props.onChange()}
                className="w-4 h-4 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded
             focus:outline-none focus:ring-0 focus:ring-offset-0" />
            <label htmlFor={props.id}
                className="text-sm font-medium text-gray-500 dark:text-gray-400"> {props.labelText}</label>
        </div>
    )
}