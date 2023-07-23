import { useParams } from "react-router-dom"

export default function SearchPage() {

    const { searchText } = useParams();

    return (
        <>
            {searchText}
        </>
    )
}