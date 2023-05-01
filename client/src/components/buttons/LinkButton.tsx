import { Link } from "react-router-dom"

interface Props {
    link: string,
    text: string
}

export default function LinkButton(props: Props) {

    return (
        <Link to={props.link} className="text-sm text-blue-600 hover:text-blue-500"> {props.text}</Link>
    )
}