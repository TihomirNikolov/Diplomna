import { useTitle } from "@/components";
import { CreateCard } from "@/components/account/PaymentCardComponent";
import { FinishPageAddressComponent, FinishPagePaymentsComponent } from "@/components/finishPage";
import { FinishPageAddressHandle } from "@/components/finishPage/FinishPageAddressComponent";
import { FinishPagePaymentsHandle } from "@/components/finishPage/FinishPagePaymentsComponent";
import { Textarea } from "@/components/ui/textarea";
import { useShoppingCart, useUser } from "@/contexts";
import { Address, authClient, axiosClient, baseOrdersURL, notification } from "@/utilities";
import { Card } from "@/utilities/models/checkout/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next"

const initialAddress: Address = {
    city: '',
    country: '',
    firstName: '',
    id: 0,
    isDefault: false,
    lastName: '',
    phoneNumber: '',
    postalCode: '',
    region: '',
    streetAddress: ''
}

const initialNewCard: CreateCard = {
    cardNumber: '',
    cardholderName: '',
    month: 'January',
    year: '2023',
    cardType: 'None',
    cvv: ''
}

const initialCard: Card = {
    id: '',
    last4: '',
    type: ''
}

interface OrderItem {
    productId: string,
    count: string,
    sum: string
}

export default function FinishOrderPage() {
    const { t } = useTranslation();
    useTitle(t('title.finishOrder'));

    const { isAuthenticated } = useUser();
    const { sum, shoppingCartItems } = useShoppingCart();

    const addressRef = useRef<FinishPageAddressHandle>(null);
    const paymentsRef = useRef<FinishPagePaymentsHandle>(null);

    const [address, setAddress] = useState<Address>(initialAddress);
    const [newCard, setNewCard] = useState<CreateCard>(initialNewCard);
    const [card, setCard] = useState<Card>(initialCard);
    const [comment, setComment] = useState<string>('');

    async function onSubmit() {
        console.log('is new card: ' + paymentsRef.current?.isNewCard);
        if (!addressRef.current?.validate()) {
            notification.error(t('errorInput.addressInputInvalid'), 'top-center');
            return;
        }

        if (!paymentsRef.current?.validate()) {
            notification.error(t('errorInput.cardInputInvalid'), 'top-center');
            return;
        }

        try {
            var items: OrderItem[] = [];
            for (var item of shoppingCartItems) {
                items.push({
                    productId: item.productId,
                    count: item.number.toString(),
                    sum: (item.price * item.number).toString()
                })
            }
            if (isAuthenticated) {
                var response = await authClient.post(`${baseOrdersURL()}api/orders/create/email`, { orderItems: items, comment: comment })
            }
            else {
                var response = await axiosClient.post(`${baseOrdersURL()}api/orders/create/browserid`,
                    {
                        orderItems: items,
                        comment: comment,
                        browserId: localStorage.getItem('uuid')
                    })
            }
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
            console.log(error);
        }
    }

    return (
        <div className="grid md:grid-cols-12 px-3 md:px-0">
            <div className="md:col-start-3 md:col-span-8">
                <h1 className="text-black dark:text-white text-2xl font-bold">{t('title.finishOrder')}</h1>
                <div className="grid md:grid-cols-6 space-x-2 mt-10">
                    <div className="col-span-4">
                        <div className="border border-gray-300 dark:border-gray-800 rounded-lg px-2 py-2">
                            <h1 className="text-black dark:text-white text-2xl font-bold py-2">{t('address.address')}</h1>
                            <FinishPageAddressComponent ref={addressRef} address={address} setAddress={setAddress} />
                        </div>
                        <div className="mt-10 border border-gray-300 dark:border-gray-800 rounded-lg px-2 py-2">
                            <h1 className="text-black dark:text-white text-2xl font-bold py-2">{t('paymentMethod')}</h1>
                            <FinishPagePaymentsComponent ref={paymentsRef}
                                card={card} setCard={setCard}
                                newCard={newCard} setNewCard={setNewCard} />
                        </div>
                    </div>

                    <div className="col-span-2 hidden md:block">
                        <Finish sum={sum} onSubmit={onSubmit} />
                    </div>

                </div>

                <div className="mt-10 border border-gray-300 dark:border-gray-800 rounded-lg px-2 py-2">
                    <div className="flex items-center space-x-2 py-2">
                        <FontAwesomeIcon icon={['fas', 'comment']} size="2x" className="text-black dark:text-white" />
                        <h1 className="text-black dark:text-white text-2xl font-bold">{t('addComment')}</h1>
                    </div>
                    <Textarea className="text-black dark:text-white" placeholder={t('comment') || ''} value={comment}
                        onChange={(e) => setComment(e.target.value)} />
                </div>

                <div className="col-span-2 md:hidden">
                    <Finish sum={sum} onSubmit={onSubmit} />
                </div>
            </div>
        </div>
    )
}

interface FinishProps {
    sum: number,
    onSubmit: () => void
}

function Finish({ sum, onSubmit }: FinishProps) {
    const { t } = useTranslation();

    return (
        <>
            <div className="flex flex-col justify-between py-2 border border-gray-300 dark:border-gray-800 rounded-lg
                                    text-black dark:text-white max-h-56">
                <div className="flex space-x-2 items-center px-2">
                    <FontAwesomeIcon icon={['fas', 'money-bill']} />
                    <h1 className="text-2xl">{t('dueAmmount')}</h1>
                </div>
                <div className="flex w-full justify-end px-2">
                    <span className="text-2xl">{t('total')}: </span>
                    <span className="text-2xl">{sum}</span>
                </div>
            </div>
            <button className="w-full text-white text-center py-2 mt-5 bg-orange-600 rounded-lg hover:bg-orange-700"
                onClick={onSubmit}>
                {t('finishOrder')}
            </button>
        </>
    )
}