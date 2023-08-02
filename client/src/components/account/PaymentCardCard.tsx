import { Card } from "@/utilities/models/checkout/Card"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import visa from '../../assets/visa.png'
import mastercard from '../../assets/mastercard.png'
import discover from '../../assets/discover.png'
import americanEexpress from '../../assets/american-express.png'
import emptyCard from '../../assets/empty-card.png'

interface Props {
    card: Card,
    onCardDeleted: (card: Card) => void;
}

export default function PaymentCardCard({ card, onCardDeleted }: Props) {



    return (
        <div className="relative text-white">
            <img src={visa} className="w-72" />
            <div className="absolute bottom-5 left-14">
                <span className="text-2xl">************{card.last4}</span>
            </div>
            <div className="absolute top-0 right-1">
                <FontAwesomeIcon icon={['fas', 'x']}
                    className="hover:text-red-600 cursor-pointer"
                    onClick={() => onCardDeleted(card)} />
            </div>
        </div>
    )
}