import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function Favourites() {

    return (
        <Link to='/wishlist' className="flex gap-2 cursor-pointer">
            <FontAwesomeIcon icon={["fas", "heart"]} size="lg" className="text-gray-900 dark:text-white hover:dark:text-pink-500 hover:text-pink-500" />
        </Link>
    )
}