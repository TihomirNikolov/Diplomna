
interface IProps {
    link: string,
    text: string
}

export default function LinkButton(props: IProps) {

    return (
        <a href={props.link} className="text-sm text-blue-600 hover:text-blue-500"> {props.text}</a>
    )
}