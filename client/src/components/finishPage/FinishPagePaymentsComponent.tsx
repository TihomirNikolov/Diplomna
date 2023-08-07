import { useTranslation } from "react-i18next";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Dispatch, Fragment, SetStateAction, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Card } from "@/utilities/models/checkout/Card";
import { authClient, basePaymentsURL } from "@/utilities";
import axios from "axios";
import { Listbox, Transition } from "@headlessui/react";
import { PaymentCardComponent } from "../account";
import { CreateCard, PaymentCardHandle } from "../account/PaymentCardComponent";
import { useUser } from "@/contexts";

const initialCard: Card = {
    id: '',
    last4: '',
    type: ''
}

const createNewCard: Card = {
    id: '',
    last4: '',
    type: ''
}

export type FinishPagePaymentsHandle = {
    validate: () => boolean,
    isNewCard: boolean
}

interface Props {
    card: Card,
    setCard: Dispatch<SetStateAction<Card>>,
    newCard: CreateCard,
    setNewCard: Dispatch<SetStateAction<CreateCard>>
}

const FinishPagePaymentsComponent = forwardRef<FinishPagePaymentsHandle, Props>(({ card, setCard, newCard, setNewCard }, ref) => {
    const { t } = useTranslation();

    const [cards, setCards] = useState<Card[]>([]);
    const [selectedCard, setSelectedCard] = useState<Card>(createNewCard);

    const paymentCardRef = useRef<PaymentCardHandle>(null);

    const { isAuthenticated } = useUser();

    useImperativeHandle(ref, () => ({
        validate: () => {
            paymentCardRef.current?.showValidation();
            return paymentCardRef.current?.isValid || selectedCard != createNewCard;
        },
        isNewCard: selectedCard == createNewCard
    }))

    async function fetchCards() {
        try {
            var response = await authClient.get(`${basePaymentsURL()}api/cards`)

            var data = response.data as Card[];
            setCards(data);
            if (data.length > 0) {
                setSelectedCard(data[0]);
            }
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchCards();
        }
    }, [])

    function onCardChanged(card: Card) {
        setCard(card);
        setSelectedCard(card);
    }

    return (
        <>
            <RadioGroup defaultValue='cardPayment' >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value='cardPayment' id='cardPayment' />
                    <label htmlFor="cardPayment" className="text-black dark:text-white">{t('cardPayment')}</label>
                </div>
            </RadioGroup>
            {isAuthenticated &&
                <Listbox value={selectedCard} onChange={onCardChanged}>
                    {({ open }) => (
                        <>
                            <div className="relative w-full py-5">
                                <Listbox.Button className="relative rounded-md bg-transparent border w-full text-start
                                            border-gray-300 dark:border-gray-800
                                             px-1.5 py-3 text-gray-900 dark:text-white sm:text-sm sm:leading-">
                                    <span className="text-xl">
                                        {selectedCard != createNewCard ?
                                            <span>
                                                {selectedCard.type} {selectedCard.last4.padStart(16, '*')}
                                            </span> :
                                            <span>
                                                {t('card.addNewCard')}
                                            </span>}
                                    </span>
                                </Listbox.Button>

                                <Transition
                                    show={open}
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0">
                                    <Listbox.Options className="absolute z-10 w-full bg-white dark:bg-darkBackground-800 shadow-lg rounded-lg px-2">
                                        {cards.map((card, index) => {
                                            return (
                                                <Listbox.Option value={card} key={index} className="w-full text-xl text-black py-1 dark:text-white
                                                        hover:text-orange-500 hover:dark:text-orange-500 cursor-pointer">
                                                    <span>
                                                        {card.type} {card.last4.padStart(16, '*')}
                                                    </span>
                                                </Listbox.Option>
                                            )
                                        })}
                                        <Listbox.Option value={createNewCard} className="w-full text-xl text-black py-1 dark:text-white
                                                        hover:text-orange-500 hover:dark:text-orange-500 cursor-pointer">
                                            <span>{t('card.addNewCard')}</span>
                                        </Listbox.Option>
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </>
                    )}
                </Listbox>}

            {(selectedCard == createNewCard || !isAuthenticated) &&
                <>
                    <div>
                        <PaymentCardComponent ref={paymentCardRef} card={newCard} setCard={setNewCard} />
                    </div>
                </>
            }
        </>
    )
})

export default FinishPagePaymentsComponent;