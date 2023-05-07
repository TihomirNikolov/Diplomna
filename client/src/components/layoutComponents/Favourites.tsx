import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

export default function Favourites() {
    const navigate = useNavigate();
    
    return (
        <div className="flex gap-2 cursor-pointer" onClick={() => navigate('/wishlist')}>
            <FontAwesomeIcon icon={["fas", "heart"]} size="lg" className="text-gray-900 dark:text-white hover:dark:text-pink-500 hover:text-pink-500" />
        </div>
    )
}