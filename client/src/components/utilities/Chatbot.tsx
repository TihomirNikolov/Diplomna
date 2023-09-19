import { axiosClient, baseChatbotUrl } from "@/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import axios from "axios";
import { Fragment, useState } from "react";
import TypeWriter from "./TypeWriter";
import { useTranslation } from "react-i18next";

interface Message {
  text: string;
  fromUser: boolean;
  isError?: boolean;
  isNewMessage: boolean;
}

export default function Chatbot() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  const [isChatbotWriting, setIsChatbotWriting] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  async function handleSendMessage() {
    if (input == "") return;
    setIsChatbotWriting(true);

    setMessages((prev) => {
      return [...prev, { text: input, fromUser: true, isNewMessage: true }];
    });

    try {
      var result = await axiosClient.post(
        `${baseChatbotUrl()}api/chatbot/send`,
        { message: input },
      );
      var data = result.data as string;
      setMessages((prev) => {
        return [
          ...prev,
          {
            text: data,
            fromUser: false,
            isNewMessage: true,
          },
        ];
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessages((prev) => {
          return [
            ...prev,
            {
              text: "There was an error in generating response. Please try again later",
              fromUser: false,
              isError: true,
              isNewMessage: true,
            },
          ];
        });
      }
    }
    setInput("");
    setIsChatbotWriting(false);
  }

  function onTextWritten(message: string) {
    var updatedMessages = [...messages];

    var updatedMessage = updatedMessages.find((m) => m.text == message);
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
          leaveTo="opacity-0 translate-y-1"
        >
          <div className="ml-5 flex h-[600px] w-full flex-col justify-between rounded-lg bg-white dark:bg-gray-700 md:ml-0 md:w-96">
            <div>
              <div className="h-[100px] w-full rounded-lg bg-orange-500 p-2">
                <span className="text-white">{t("chatbot")}</span>
              </div>
              <div className="flex h-[450px] flex-col gap-2 overflow-auto break-words p-2">
                {messages.map((message, index) => {
                  return (
                    <div key={index} className="grid">
                      {message.isNewMessage ? (
                        <TypeWriter
                          text={message.text}
                          onTextWritten={onTextWritten}
                          className={`max-w-3/4 rounded p-2 text-white dark:text-black
                                            ${
                                              message.fromUser
                                                ? "justify-self-start bg-blue-500"
                                                : `justify-self-end
                                                    ${
                                                      message.isError
                                                        ? "bg-red-500"
                                                        : "bg-green-500"
                                                    }`
                                            }`}
                        />
                      ) : (
                        <span
                          className={`max-w-3/4 rounded p-2 text-white dark:text-black 
                                            ${
                                              message.fromUser
                                                ? "justify-self-start bg-blue-500"
                                                : `justify-self-end
                                                    ${
                                                      message.isError
                                                        ? "bg-red-500"
                                                        : "bg-green-500"
                                                    }`
                                            }`}
                        >
                          {message.text}
                        </span>
                      )}
                    </div>
                  );
                })}
                <Transition
                  show={isChatbotWriting}
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <div className="grid w-full">
                    <div className="flex w-1/2 gap-2 justify-self-end rounded bg-orange-500 p-2 text-white dark:text-black">
                      <FontAwesomeIcon
                        icon={["fas", "circle"]}
                        className="animate-bounce text-white dark:text-gray-700"
                        size="xs"
                      />
                      <FontAwesomeIcon
                        icon={["fas", "circle"]}
                        className="animate-bounce text-white delay-100 dark:text-gray-700"
                        size="xs"
                      />
                      <FontAwesomeIcon
                        icon={["fas", "circle"]}
                        className="animate-bounce text-white delay-200 dark:text-gray-700"
                        size="xs"
                      />
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
            <div className="flex h-[50px] gap-2 p-2">
              <input
                className="w-full rounded-lg border p-2 outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                onClick={handleSendMessage}
                disabled={isChatbotWriting}
                className="text-orange-500 disabled:text-gray-200"
              >
                <FontAwesomeIcon
                  icon={["far", "circle-right"]}
                  size="2x"
                  className=" cursor-pointer"
                />
              </button>
            </div>
          </div>
        </Transition>
      </div>
      <div className="fixed bottom-8 right-10 z-50">
        <FontAwesomeIcon
          icon={["fas", `${isOpen ? "x" : "message"}`]}
          size="lg"
          className="w-14 cursor-pointer rounded bg-orange-500 py-4 text-white shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
    </>
  );
}
