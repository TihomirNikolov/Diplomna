import { Dialog, Transition } from "@headlessui/react";
import { Fragment, MouseEventHandler, useState } from "react";
import { BlackWhiteButton } from "../buttons";
import { useTranslation } from "react-i18next";

interface Props {
    children: React.ReactNode[],
    submit: () => Promise<boolean>
}

export default function Modal(props: Props) {
    const [isOpen, setIsOpen] = useState(false)

    const { t } = useTranslation();

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    async function submit() {
        if (await props.submit()) {
            setIsOpen(false);
        }
    }

    return (
        <div>
            <div onClick={openModal}>
                {props.children[0]}
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">

                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95">

                                <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                    {props.children[1]}

                                    <div className="flex mt-4 items-center justify-center">
                                        <BlackWhiteButton onClick={submit}>
                                            {t('save')}
                                        </BlackWhiteButton>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}

function Button(props: any) {

    return (
        <>
            {props.children}
        </>
    )
}

function Content(props: any) {

    return (
        <>
            {props.children}
        </>
    )
}

Modal.Button = Button;
Modal.Content = Content;