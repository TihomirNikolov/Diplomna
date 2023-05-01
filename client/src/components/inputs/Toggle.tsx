import { ChangeEventHandler } from "react"

interface Props{
    checked: boolean,
    onChange: ChangeEventHandler<HTMLInputElement>
}

export default function Toggle(props: Props) {

    return (
        <>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" checked={props.checked} onChange={props.onChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-black"></div>
            </label>
        </>
    )
}