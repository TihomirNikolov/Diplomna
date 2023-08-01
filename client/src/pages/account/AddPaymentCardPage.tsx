import { BlackWhiteButton, FloatingInput, Input, useTitle } from "@/components";
import { FormEvent, Fragment, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import creditCard from "../../assets/Credit-Card.png"
import { validateCVV, validateCardExpiry, validateCardNumber, validateCardholderName } from "@/utilities/validations/Validators";
import { Listbox, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputHandle } from "@/components/inputs/Input";
import axios from "axios";
import { authClient, basePaymentsURL } from "@/utilities";

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const years = ['2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032']

type MonthsType = typeof months[number]
type YearsType = typeof years[number]

export default function AddPaymentCardPage() {
    const { t } = useTranslation();
    useTitle(t('title.addNewAddress'));

    const cardNumberRef = useRef<InputHandle>(null);
    const cardholderNameRef = useRef<InputHandle>(null);
    const cvvRef = useRef<InputHandle>(null);

    const [selectedMonth, setSelectedMonth] = useState<MonthsType>('Month');
    const [selectedYear, setSelectedYear] = useState<YearsType>('Year');
    const [cardType, setCardType] = useState<string>('')

    function onSelectedMonthChanged(month: string) {
        setSelectedMonth(month);
    }

    function onSelectedYearChanged(year: string) {
        setSelectedYear(year);
    }

    function checkCardType(cardNumber: string){
        if(cardNumber.match(/^(?:2131|1800|35)[0-9]{0,}$/)){
            return 'JCB';
        }

        if(cardNumber.match(/^3[47][0-9]{0,}$/)){
            return 'American Express';
        }

        if(cardNumber.match(/^3(?:0[0-59]{1}|[689])[0-9]{0,}$/)){
            return 'Diners Club';
        }
        
        if(cardNumber.match(/^4[0-9]{0,}$/)){
            return 'Visa';
        }

        if(cardNumber.match(/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)[0-9]{0,}$/)){
            return 'MasterCard';
        }

        if(cardNumber.match(/^(5[06789]|6)[0-9]{0,}$/)){
            return 'Maestro';
        }

        if(cardNumber.match(/^(6011|65|64[4-9]|62212[6-9]|6221[3-9]|622[2-8]|6229[01]|62292[0-5])[0-9]{0,}$/)){
            return 'Discover';
        }

        return '';
    }

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!cardNumberRef.current?.isValid
            || !cardholderNameRef.current?.isValid
            || !cvvRef.current?.isValid
            || selectedMonth == 'Month'
            || selectedYear == 'Year') {
            cardNumberRef.current?.showValidation();
            cardholderNameRef.current?.showValidation();
            cvvRef.current?.showValidation();
            return;
        }
        
        try {
            var cardRequest = {
                cardNumber: cardNumberRef.current.value,
                cardholderName: cardholderNameRef.current.value,
                month: selectedMonth,
                year: selectedYear,
                cvv: cvvRef.current.value,
                cardType: checkCardType(cardNumberRef.current.value)
            }

            var result = await authClient.post(`${basePaymentsURL()}api/cards/add`, cardRequest);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
        }
    }

    return (
        <div className="grid grid-cols-5 mx-1 md:ml-0 md:mr-0">
            <div className="col-span-5 lg:col-span-3 lg:col-start-2">
                <h1 className="text-black dark:text-white font-bold mb-5">{t('card.addNewCard')}</h1>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <div className="grid">
                        <form className="grid p-5 space-y-5" onSubmit={onSubmit}>
                            <img src={creditCard} className="w-full md:w-96 justify-self-center" />
                            <div className="mt-5">
                                <Input ref={cardNumberRef}
                                    className="w-full"
                                    type="text" placeholder={t('card.cardNumber')}
                                    validate={validateCardNumber} immediateValdation
                                    validationMessage={t('errorInput.cardNumberInvalid')!} />
                                <Input ref={cardholderNameRef}
                                    className="w-full"
                                    type="text" placeholder={t('card.cardholderName')}
                                    validate={validateCardholderName} immediateValdation
                                    validationMessage={t('errorInput.cardholderNameInvalid')!} />
                                <div className="w-full flex flex-wrap sm:space-x-1 justify-between">
                                    <div>
                                        <span className="text-lg">Expires</span>
                                        <Listbox value={selectedMonth} onChange={onSelectedMonthChanged}>
                                            {({ open }) => (
                                                <div className="relative w-44">
                                                    <Listbox.Button className="w-full bg-white dark:bg-darkBackground-800
                                                                 text-black dark:text-white border p-1 rounded-lg">
                                                        <div className="flex w-full items-center justify-between">
                                                            <span>{selectedMonth}</span>
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
                                        <span className="text-lg">Year</span>
                                        <Listbox value={selectedYear} onChange={onSelectedYearChanged}>
                                            {({ open }) => (
                                                <div className="relative w-44">
                                                    <Listbox.Button className="w-full bg-white dark:bg-darkBackground-800
                                                                 text-black dark:text-white border p-1 rounded-lg">
                                                        <div className="flex w-full items-center justify-between">
                                                            <span>{selectedYear}</span>
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
                                    <div className="flex items-end">
                                        <Input ref={cvvRef}
                                            type="text" placeholder={"CVV/CVC"}
                                            validate={validateCVV} immediateValdation
                                            validationMessage={t('errorInput.cvvInvalid')!} />
                                    </div>
                                </div>
                            </div>
                            <BlackWhiteButton className="w-48 justify-self-center">{t('save')}</BlackWhiteButton>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}