import { BlackWhiteButton, useTitle } from "@/components";
import { FormEvent, Fragment, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { authClient, basePaymentsURL } from "@/utilities";
import { useNavigate } from "react-router-dom";
import { PaymentCardComponent } from "@/components/account";
import { CreateCard, PaymentCardHandle } from "@/components/account/PaymentCardComponent";

const initialCard: CreateCard = {
    cardNumber: '',
    cardholderName: '',
    month: 'January',
    year: '2023',
    cardType: 'None',
    cvv: ''
}

export default function AddPaymentCardPage() {
    const { t } = useTranslation();
    useTitle(t('title.addNewAddress'));

    const [card, setCard] = useState<CreateCard>(initialCard);

    const paymentCardRef = useRef<PaymentCardHandle>(null);

    const navigate = useNavigate();

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!paymentCardRef.current?.isValid) {
            paymentCardRef.current?.showValidation();
            return;
        }

        try {
            var cardRequest = {
                cardNumber: card.cardNumber,
                cardholderName: card.cardholderName,
                month: card.month,
                year: card.year,
                cvv: card.cvv,
                cardType: card.cardType
            }

            var result = await authClient.post(`${basePaymentsURL()}api/cards/add`, cardRequest);
            navigate('/payments/cards');
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
            console.log(error)
        }
    }

    return (
        <div className="grid grid-cols-5 mx-1 md:ml-0 md:mr-0">
            <div className="col-span-5 lg:col-span-3 lg:col-start-2">
                <h1 className="text-black dark:text-white font-bold my-3 text-2xl">{t('card.addNewCard')}</h1>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <div className="grid">
                        <form className="grid p-5 space-y-5" onSubmit={onSubmit}>
                            <PaymentCardComponent ref={paymentCardRef} card={card} setCard={setCard} />
                            <BlackWhiteButton className="w-48 justify-self-center">{t('save')}</BlackWhiteButton>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}