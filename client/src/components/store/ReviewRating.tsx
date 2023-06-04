import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react"

interface Props {
    rating: number
}

export default function ReviewRating(props: Props) {

    function renderStars() {
        const stars: ReactNode[] = []

        var yellowStars = Math.round(props.rating);
        var grayStars = 5 - yellowStars;

        for (var i = 0; i < yellowStars; i++) {
            stars.push(
                <FontAwesomeIcon key={i} icon={['fas', 'star']} className="text-yellow-500" />
            )
        }

        for (var i = 0; i < grayStars; i++) {
            stars.push(
                <FontAwesomeIcon key={yellowStars + i + 1} icon={['fas', 'star']} className="text-gray-500" />
            )
        }

        return stars;
    }

    return (
        <div>
            {renderStars()}
        </div>
    )
}