

interface Props {
    percent: number
    className?: string
}

export default function ProgressBar(props: Props) {

    return (
        <div className={`bg-gray-300 rounded-full h-2.5 dark:bg-gray-700 ${props.className}`}>
            <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${isNaN(props.percent) == false ? props.percent : 0}%` }} />
        </div>
    )
}