import { MouseEventHandler } from "react"

interface Props {
    children: React.ReactNode,
    onClick?: MouseEventHandler<HTMLButtonElement>,
    className?: string
}

export default function BlackWhiteButton(props: Props) {

    return (
        <button className={`border-2 border-black dark:border-white px-5 py-1 rounded-lg 
                            hover:bg-black hover:dark:bg-white text-black dark:text-white
                             hover:text-white hover:dark:text-black ${props.className !== undefined ? `${props.className}` : ''} `}
            onClick={props.onClick}>
            {props.children}
        </button>
    )
}