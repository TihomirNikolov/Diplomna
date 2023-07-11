interface Props {
    checked: boolean,
    onChange: () => void,
    labelText?: string,
    id: string
}

export default function Checkbox(props: Props) {

    return (
        <div className="flex items-center">
            <input id={props.id} type="checkbox" checked={props.checked} readOnly={true} onChange={() => props.onChange()}
                className="w-4 h-4 rounded border-transparent focus:outline-none focus:ring-0 focus:ring-offset-0
                 text-blue-600 checked:bg-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600" />
            <label htmlFor={props.id}
                className="pl-1 text-black dark:text-white"> {props.labelText}</label>
        </div>
    )
}