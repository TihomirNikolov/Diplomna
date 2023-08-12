import { useTranslation } from "react-i18next";
import { AddNewPaymentCard, PaymentCardCard, useTitle } from "../../components";
import { useEffect, useState } from "react";
import axios from "axios";
import { authClient, basePaymentsURL } from "@/utilities";
import { Card } from "@/utilities/models/checkout/Card";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentCardsPage() {
    const { t } = useTranslation();
    useTitle(t('title.paymentCards'));

    const [cards, setCards] = useState<Card[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function fetchCards() {
        try {
            setIsLoading(true);
            var response = await authClient.get(`${basePaymentsURL()}api/cards`)

            var data = response.data as Card[];
            setCards(data);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
        }
        setIsLoading(false);
    }

    useEffect(() => {
        fetchCards();
    }, [])

    async function deleteCard(card: Card) {
        try {
            await authClient.delete(`${basePaymentsURL()}api/cards/delete/${card.id}`);
            setCards(prev => {
                var newCards = prev.filter(c => c.id != card.id);
                return newCards;
            })
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
        }
    }

    return (
        <div className="mx-1 md:ml-0 md:mr-0 mb-2 md:mb-0">
            <h1 className="text-black dark:text-white font-bold text-2xl mb-5">{t('myAddresses')}</h1>
            <section className="flex flex-wrap gap-4 justify-center sm:justify-start">
                <AddNewPaymentCard />
                {isLoading ?
                    <>
                        {new Array(3).fill(null).map((_, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <Skeleton className="w-72 h-[180px]" />
                                </React.Fragment>
                            )
                        })}
                    </>
                    :
                    <>
                        {cards.map((card, index) => {
                            return (
                                <div key={index}>
                                    <PaymentCardCard card={card} onCardDeleted={deleteCard} />
                                </div>
                            )
                        })}
                    </>
                }
            </section>
        </div>
    )
}