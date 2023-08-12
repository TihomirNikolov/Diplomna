import { Fragment, forwardRef, useRef, useState, useImperativeHandle, SetStateAction, Dispatch } from "react";
import Input, { InputHandle } from "../inputs/Input";

import visa from '../../assets/visa.png'
import mastercard from '../../assets/mastercard.png'
import discover from '../../assets/discover.png'
import americanEexpress from '../../assets/american-express.png'
import emptyCard from '../../assets/empty-card.png'
import { validateCVV, validateCardNumber, validateCardholderName } from "@/utilities/validations/Validators";
import { useTranslation } from "react-i18next";
import { Listbox, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "@/utilities/models/checkout/Card";
import { Image } from "../utilities";

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const years = ['2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032']

type MonthsType = typeof months[number]
type YearsType = typeof years[number]

type cardType = 'None' | 'JCB' | 'American Express' | 'Diners Club' | 'Visa' | 'MasterCard' | 'Discover'

export type PaymentCardHandle = {
    isValid: boolean,
    showValidation: () => void
}

export interface CreateCard {
    cardNumber: string,
    cardholderName: string,
    month: MonthsType,
    year: YearsType,
    cardType: cardType,
    cvv: string
}

interface Props {
    card: CreateCard,
    setCard: Dispatch<SetStateAction<CreateCard>>
}

const PaymentCardComponent = forwardRef<PaymentCardHandle, Props>(({ card, setCard }, ref) => {
    const { t } = useTranslation();

    const cardNumberRef = useRef<InputHandle>(null);
    const cardholderNameRef = useRef<InputHandle>(null);
    const cvvRef = useRef<InputHandle>(null);

    const [imgSource, setImageSource] = useState<string>(emptyCard);

    useImperativeHandle(ref, () => ({
        isValid: validate(),
        showValidation: showValidation
    }))

    function validate() {
        if (!cardNumberRef.current?.isValid
            || !cardholderNameRef.current?.isValid
            || !cvvRef.current?.isValid)
            return false;
        return true;
    }

    function showValidation() {
        cardNumberRef.current?.showValidation();
        cardholderNameRef.current?.showValidation();
        cvvRef.current?.showValidation();
    }

    function onSelectedMonthChanged(month: string) {
        setCard(prev => { return { ...prev, month: month } });
    }

    function onSelectedYearChanged(year: string) {
        setCard(prev => { return { ...prev, year: year } });
    }

    function onCardNumberChanged(value: string) {
        setCard(prev => { return { ...prev, cardNumber: value } });
        var cardType = checkCardType(value);
        setCard(prev => { return { ...prev, cardType: cardType } });
        changeImage(cardType);
    }

    function onCardholderNameChanged(value: string) {
        setCard(prev => { return { ...prev, cardholderName: value } });
    }

    function onCvvChanged(value: string) {
        setCard(prev => { return { ...prev, cvv: value } });
    }

    function checkCardType(cardNumber: string): cardType {
        if (cardNumber.match(/^(?:2131|1800|35)[0-9]{0,}$/)) {
            return 'JCB';
        }

        if (cardNumber.match(/^3[47][0-9]{0,}$/)) {
            return 'American Express';
        }

        if (cardNumber.match(/^3(?:0[0-59]{1}|[689])[0-9]{0,}$/)) {
            return 'Diners Club';
        }

        if (cardNumber.match(/^4[0-9]{0,}$/)) {
            return 'Visa';
        }

        if (cardNumber.match(/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)[0-9]{0,}$/)) {
            return 'MasterCard';
        }

        if (cardNumber.match(/^(6011|65|64[4-9]|62212[6-9]|6221[3-9]|622[2-8]|6229[01]|62292[0-5])[0-9]{0,}$/)) {
            return 'Discover';
        }

        return 'None';
    }

    function changeImage(cardType: cardType) {
        switch (cardType) {
            case 'American Express':
                setImageSource(americanEexpress);
                break;
            case 'Discover':
                setImageSource(discover);
                break;
            case 'MasterCard':
                setImageSource(mastercard);
                break;
            case 'Visa':
                setImageSource(visa);
                break;
            default:
                setImageSource(emptyCard)
        }
    }

    return (
        <>
            <div className="relative">
                <Image src={imgSource} alt="card" className="w-full md:w-96 justify-self-center rounded-lg" />
                <div className="absolute bottom-10 left-10">
                    <span className="text-black font-bold text-2xl">{card.cardNumber}</span>
                </div>
                <div className="absolute bottom-2 left-10">
                    <span className="text-black font-bold text-2xl">{card.cardholderName}</span>
                </div>
            </div>
            <div className="mt-5">
                <Input ref={cardNumberRef}
                    className="w-full"
                    type="text" placeholder={t('card.cardNumber')}
                    onChange={onCardNumberChanged}
                    maxLength={19}
                    validate={validateCardNumber} immediateValdation
                    validationMessage={t('errorInput.cardNumberInvalid')!} />
                <Input ref={cardholderNameRef}
                    className="w-full"
                    type="text" placeholder={t('card.cardholderName')}
                    onChange={onCardholderNameChanged}
                    maxLength={24}
                    validate={validateCardholderName} immediateValdation
                    validationMessage={t('errorInput.cardholderNameInvalid')!} />
                <div className="w-full flex flex-wrap sm:space-x-1 justify-between">
                    <div>
                        <span className="text-lg text-black dark:text-white">{t('expires')}</span>
                        <Listbox value={card.month} onChange={onSelectedMonthChanged}>
                            {({ open }) => (
                                <div className="relative w-44">
                                    <Listbox.Button className="w-full bg-white dark:bg-darkBackground-800
                                                                 text-black dark:text-white border p-1 rounded-lg">
                                        <div className="flex w-full items-center justify-between">
                                            <span>{card.month}</span>
                                            {open == true ?
                                                <FontAwesomeIcon icon={['fas', 'chevron-up']} /> :
                                                <FontAwesomeIcon icon={['fas', 'chevron-down']} />}
                                        </div>
                                    </Listbox.Button>

                                    <Transition
                                        show={open}
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1">
                                        <Listbox.Options className="absolute z-10 w-full bg-white dark:bg-darkBackground-800 shadow-lg rounded-lg">
                                            {months.map((value, index) => {
                                                return (
                                                    <Listbox.Option value={value} key={index} className="w-full text-center text-black py-1 dark:text-white
                                                            hover:text-orange-500 hover:dark:text-orange-500 cursor-pointer">
                                                        {value}
                                                    </Listbox.Option>
                                                )
                                            })}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            )}
                        </Listbox>
                    </div>
                    <div>
                        <span className="text-lg text-black dark:text-white">{t('year')}</span>
                        <Listbox value={card.year} onChange={onSelectedYearChanged}>
                            {({ open }) => (
                                <div className="relative w-44">
                                    <Listbox.Button className="w-full bg-white dark:bg-darkBackground-800
                                                                 text-black dark:text-white border p-1 rounded-lg">
                                        <div className="flex w-full items-center justify-between">
                                            <span>{card.year}</span>
                                            {open == true ?
                                                <FontAwesomeIcon icon={['fas', 'chevron-up']} /> :
                                                <FontAwesomeIcon icon={['fas', 'chevron-down']} />}
                                        </div>
                                    </Listbox.Button>

                                    <Transition
                                        show={open}
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1">
                                        <Listbox.Options className="absolute z-10 w-full bg-white dark:bg-darkBackground-800 shadow-lg rounded-lg">
                                            {years.map((value, index) => {
                                                return (
                                                    <Listbox.Option value={value} key={index} className="w-full text-center text-black py-1 dark:text-white
                                                            hover:text-orange-500 hover:dark:text-orange-500 cursor-pointer">
                                                        {value}
                                                    </Listbox.Option>
                                                )
                                            })}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            )}
                        </Listbox>
                    </div>
                    <div className="w-64">
                        <Input ref={cvvRef}
                            type="text" placeholder={"CVV/CVC"}
                            validate={validateCVV} immediateValdation
                            validationMessage={t('errorInput.cvvInvalid')!}
                            onChange={(cvv) => onCvvChanged(cvv)} />
                    </div>
                </div>
            </div>
        </>
    )
})

export default PaymentCardComponent;