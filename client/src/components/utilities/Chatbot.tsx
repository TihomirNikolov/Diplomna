import { axiosClient, baseChatbotUrl } from "@/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import axios from "axios";
import { Fragment, useState } from "react";
import TypeWriter from "./TypeWriter";

interface Message {
    text: string,
    fromUser: boolean,
    isError?: boolean,
    isNewMessage: boolean
}

export default function Chatbot() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');

    const [isChatbotWriting, setIsChatbotWriting] = useState<boolean>(false);

    const [isOpen, setIsOpen] = useState<boolean>(false);

    async function handleSendMessage() {
        if (input == '')
            return;
        setIsChatbotWriting(true);

        setMessages(prev => {
            return (
                [...prev, { text: input, fromUser: true, isNewMessage: true }]
            )
        })

        try {
            var result = await axiosClient.post(`${baseChatbotUrl()}api/chatbot/send`, { message: input });
            var data = result.data as string;
            setMessages(prev => {
                return (
                    [...prev,
                    {
                        text: data,
                        fromUser: false,
                        isNewMessage: true
                    }]
                )
            })
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                setMessages(prev => {
                    return (
                        [...prev,
                        {
                            text: "There was an error in generating response. Please try again later",
                            fromUser: false,
                            isError: true,
                            isNewMessage: true
                        }]
                    )
                })
            }
        }
        setInput('');
        setIsChatbotWriting(false);
    }

    function onTextWritten(message: string) {
        var updatedMessages = [...messages]

        var updatedMessage = updatedMessages.find(m => m.text == message);
        if (updatedMessage != null) {
            updatedMessage.isNewMessage = false;
            setMessages(updatedMessages);
        }
    }

    return (
        <>
            <div className="fixed bottom-24 right-10 z-50">
                <Transition
                    show={isOpen}
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1">
                    <div className="flex flex-col justify-between h-[600px] w-full ml-5 md:ml-0 md:w-96 bg-white dark:bg-gray-700 rounded-lg">
                        <div>
                            <div className="h-[100px] p-2 w-full bg-orange-500 rounded-lg">
                                <span className="text-white">Чатбот</span>
                            </div>
                            <div className="flex flex-col p-2 h-[450px] gap-2 break-words overflow-auto">
                                {messages.map((message, index) => {
                                    return (
                                        <div key={index} className='grid'>
                                            {message.isNewMessage ?
                                                <TypeWriter text={message.text} onTextWritten={onTextWritten}
                                                    className={`p-2 rounded max-w-3/4 text-white dark:text-black
                                            ${message.fromUser ? 'bg-blue-500 justify-self-start'
                                                            : `justify-self-end
                                                    ${message.isError ? 'bg-red-500' : 'bg-green-500'}`}`} />
                                                :
                                                <span className={`p-2 rounded max-w-3/4 text-white dark:text-black 
                                            ${message.fromUser ? 'bg-blue-500 justify-self-start'
                                                        : `justify-self-end
                                                    ${message.isError ? 'bg-red-500' : 'bg-green-500'}`}`}>
                                                    {message.text}
                                                </span>
                                            }
                                        </div>
                                    )
                                })}
                                <Transition
                                    show={isChatbotWriting}
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 translate-y-1"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 translate-y-1">
                                    <div className='w-full grid'>
                                        <div className='flex gap-2 p-2 rounded w-1/2 bg-orange-500 text-white dark:text-black justify-self-end'>
                                            <FontAwesomeIcon icon={['fas', 'circle']} className="animate-bounce text-white dark:text-gray-700" size="xs" />
                                            <FontAwesomeIcon icon={['fas', 'circle']} className="animate-bounce delay-100 text-white dark:text-gray-700" size="xs" />
                                            <FontAwesomeIcon icon={['fas', 'circle']} className="animate-bounce delay-200 text-white dark:text-gray-700" size="xs" />
                                        </div>
                                    </div>
                                </Transition>
                            </div>
                        </div>
                        <div className="flex h-[50px] p-2 gap-2">
                            <input className="w-full border p-2 outline-none rounded-lg" value={input} onChange={(e) => setInput(e.target.value)} />
                            <button onClick={handleSendMessage} disabled={isChatbotWriting} className="text-orange-500 disabled:text-gray-200">
                                <FontAwesomeIcon icon={['far', 'circle-right']} size="2x"
                                    className=" cursor-pointer" />
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>
            <div className="fixed bottom-8 right-10 z-50">
                <FontAwesomeIcon icon={['fas', `${isOpen ? 'x' : 'message'}`]} size="lg"
                    className="w-14 py-4 bg-orange-500 rounded cursor-pointer text-white shadow-lg"
                    onClick={() => setIsOpen(!isOpen)} />
            </div>
        </>
    )
}