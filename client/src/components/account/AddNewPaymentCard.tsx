import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import emptyCard from "../../assets/empty-card.png"

export default function AddNewPaymentCard() {
    const { t } = useTranslation();

    return (
        <>
            <Link to='/payments/cards/add'
                className=" cursor-pointer">
                <div className="relative">
                    <img src={emptyCard} className="rounded-lg" alt="card"/>
                    <div className="absolute bottom-5 right-8">
                        <span className="text-black font-bold text-xl">{t('card.addNewCard')}</span>
                    </div>
                </div>
            </Link>
        </>
    )
}