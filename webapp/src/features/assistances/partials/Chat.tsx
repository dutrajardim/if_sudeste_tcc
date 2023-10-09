import { useEffect, useState } from "react"
import { ArrowUpOnSquareIcon } from "@heroicons/react/20/solid"

import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks"
import { sendWhatsappMessage } from "../asyncThunks"
import { selectMessages, selectSendWhatsappMessageState } from "../selectors"
import MessageBox from "./MessageBox"
import { fetchAssistanceMessages } from "../asyncThunks/fetchAssistanceMessages"
import { InterpretTextCategories, Predictions } from "@aws-amplify/predictions"

interface Props {
  customerKey?: string | null
  className?: string
}

export default function Chat({ customerKey, className }: Props): JSX.Element {

  const [message, setMessage] = useState<string>('')

  const messages = useAppSelector(selectMessages)
  const sendWhatsappMessageState = useAppSelector(selectSendWhatsappMessageState)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!customerKey) return
    const promise = dispatch(fetchAssistanceMessages(customerKey))
    return () => promise.abort()
  }, [customerKey])

  useEffect(() => {
    (sendWhatsappMessageState === 'fulfilled') && setMessage("")
  }, [sendWhatsappMessageState])

  const sendMessageHandler = () => {
    Predictions.interpret({
      text: {
        source: {
          text: message,
        },
        type: InterpretTextCategories.ALL,
      }
    })
      .then(res => console.log(JSON.stringify(res, undefined, 4)))
      .catch(err => console.log(err))
    dispatch(sendWhatsappMessage(message))
  }

  return (
    <div className={`flex flex-col bg-pattern ${className}`}>

      <div className="relative grow h-full">

        {/* <ul className="absolute left-0 right-0 top-0 bottom-0 overflow-y-auto flex flex-col gap-3 p-5 scroll-auto" ref={el => { if (el) el.scrollTop = el.scrollHeight }}> */}
        <ul className="absolute left-0 right-0 top-0 bottom-0 overflow-y-auto flex flex-col-reverse gap-3 p-5">
          {messages.map((message, key) => <MessageBox key={key} messageId={message} previousMessageId={messages[Math.max(key - 1, 0)]} />)}
        </ul>

      </div>

      <div className="flex flex-row gap-3 items-center my-3 py-4 px-5">
        <textarea
          className="grow px-3 py-4 resize-none bg-neutral-200 dark:bg-neutral-700/90 dark:text-white leading-5 outline-none"
          placeholder="Mensagem"
          rows={Math.min(message.split("\n").length, 5)}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          className="button button--primary"
          onClick={sendMessageHandler}
          disabled={!message}>
          <ArrowUpOnSquareIcon className="w-6" />
        </button>
      </div>
    </div>
  )
}