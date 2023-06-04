import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


interface Props {
    letter: string,
    color: string
}


export default function Avatar(props: Props) {

    return (
        <div className="relative">
            <FontAwesomeIcon icon={['fas', 'circle']} size="4x" className={`${props.color} text-green`}/>
            <label className="absolute text-black left-7 bottom-5">{props.letter[0]}</label>
        </div>
    )
}