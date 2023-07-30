import { BlackWhiteButton, FloatingInput, Input, useTitle } from "@/components";
import { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import creditCard from "../../assets/Credit-Card.png"
import { validateCVV, validateCardExpiry, validateCardNumber, validateCardholderName } from "@/utilities/validations/Validators";

export default function AddPaymentCardPage() {
    const { t } = useTranslation();
    useTitle(t('title.addNewAddress'));

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
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
                                <Input
                                    className="w-full"
                                    type="text" placeholder={t('card.cardNumber')}
                                    validate={validateCardNumber} immediateValdation
                                    validationMessage={t('errorInput.cardNumberInvalid')!} />
                                <Input
                                    className="w-full"
                                    type="text" placeholder={t('card.cardholderName')}
                                    validate={validateCardholderName} immediateValdation
                                    validationMessage={t('errorInput.cardholderNameInvalid')!} />
                                <div className="w-full grid grid-cols-3 space-x-1">
                                    <div>
                                        <Input
                                            type="text" placeholder={t('card.expiry')}
                                            validate={validateCardExpiry} immediateValdation
                                            validationMessage={t('errorInput.expiryDateInValid')!} />
                                    </div>
                                    <div className="col-start-3">
                                        <Input
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