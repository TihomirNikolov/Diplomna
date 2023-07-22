import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {

}

export default function SearchBar(props: Props) {

    function onSearchTextChanged(text: string) {
        console.log(text);
    }

    return (
        <div className="w-full">
            <div className="flex items-center border rounded-lg">
                <FontAwesomeIcon icon={['fas', 'search']} className="text-black dark:text-white p-1" />
                <input className="bg-transparent text-black dark:text-white outline-none p-1"
                    onChange={(e) => onSearchTextChanged(e.target.value)} />
            </div>
        </div>
    )
}