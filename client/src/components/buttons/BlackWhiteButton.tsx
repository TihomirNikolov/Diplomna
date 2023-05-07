import { MouseEventHandler } from "react"

interface Props {
    children: React.ReactNode,
    onClick?: MouseEventHandler<HTMLButtonElement>
}

export default function BlackWhiteButton(props: Props) {

    return (
        <button className="border-2 border-black dark:border-white px-5 py-1 rounded-lg 
                            hover:bg-black hover:dark:bg-white text-black dark:text-white
                             hover:text-white hover:dark:text-black w-full"
            onClick={props.onClick}>
            {props.children}
        </button>
    )
}