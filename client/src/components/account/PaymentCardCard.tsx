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

    function getCardSrc() {
        switch (card.type) {
            case 'Visa':
                return visa;
            case 'Mastercard':
                return mastercard;
            case 'Discover':
                return discover;
            case 'AmericanExpress':
                return americanEexpress;
            default:
                return emptyCard;
        }
    }

    return (
        <div className="relative text-white">
            <img src={getCardSrc()} className="w-72 rounded-lg" alt="card"/>
            <div className="absolute bottom-5 left-14">
                <span className="text-2xl">{card.last4.padStart(16, '*')}</span>
            </div>
            <div className="absolute top-0 right-1">
                <FontAwesomeIcon icon={['fas', 'x']}
                    className="hover:text-red-600 cursor-pointer"
                    onClick={() => onCardDeleted(card)} />
            </div>
        </div>
    )
}