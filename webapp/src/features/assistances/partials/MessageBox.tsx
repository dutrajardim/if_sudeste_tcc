import { UserPlusIcon, UserCircleIcon } from "@heroicons/react/20/solid"
import MessageStatusIcon from "../../../components/MessageStatusIcon"
import { partialRight, toLocaleDateString, toLocaleTimeString } from "../../../helpers"
import { useAppSelector } from "../../../hooks/storeHooks"
import { selectIsMessageFromSameDay, selectMessageById, selectMessageStatusById } from "../selectors"
import MessageBoxAudio from "./MessageBoxAudio"
import MessageBoxImage from "./MessageBoxImage"

interface MessageBoxProp {
  messageId: string
  previousMessageId: string
}

export default function MessageBox({ messageId, previousMessageId }: MessageBoxProp): JSX.Element {

  const message = useAppSelector(partialRight(selectMessageById, messageId))?.Message

  const messageStatus = useAppSelector(partialRight(selectMessageStatusById, messageId))
  const isFromSameDay = useAppSelector(partialRight(selectIsMessageFromSameDay, messageId, previousMessageId))

  const isSentMessage = message?.NotificationType === "sent"
  const isReceivedMessage = message?.NotificationType === 'message'


  if (!message) return <></>

  return (
    <>
      {!isFromSameDay && (
        <li className="first:mt-auto text-sm text-gray-400/60 self-center bg-white dark:bg-neutral-900/60 p-3 my-3">
          {toLocaleDateString(message.Timestamp)}
        </li>
      )}

      {isSentMessage && (
        <li className="message-box message-box--right">
          <span className="message-box__arrow"></span>
          <div className="message-box__details">
            <span>{toLocaleTimeString(message.Timestamp)}</span>
            <span>({message.Attendent?.Name})</span>
            <MessageStatusIcon status={messageStatus} />
          </div>

          <div className="message-box__text">
            {message.Payload.TextBody.split('\n').map((text: string, textKey: number) => (
              <p key={textKey}>{text}</p>
            ))}
          </div>

        </li>
      )}


      {isReceivedMessage && (
        <>

          {message.Payload.MessageType === 'text' && (
            <li className="message-box message-box--left">
              <span className="message-box__arrow"></span>
              <div className="message-box__details">
                <span>{toLocaleTimeString(message.Timestamp)}</span>
                <span>({message.Payload.NotificationContact?.ProfileName})</span>
              </div>

              <div className="message-box__text">
                {message.Payload.TextBody.split('\n').map((text: string, textKey: number) => (
                  <p key={textKey}>{text}</p>
                ))}
              </div>

            </li>
          )}

          {message.Payload.MessageType === 'contacts' && (
            <li className="message-box message-box--left">
              <span className="message-box__arrow"></span>
              <div className="message-box__details">
                <span>{toLocaleTimeString(message.Timestamp)}</span>
                <span>({message.Payload.NotificationContact?.ProfileName})</span>
              </div>

              <div className="flex flex-col mt-5">
                <div className="text-center md:text-start leading-7 border-b border-neutral-300/20">Contatos</div>
                {message.Payload.Contacts.map((contact, key) => (
                  <div key={key} className="flex flex-col md:flex-row py-3 items-center gap-3">
                    <UserCircleIcon className="h-12" />
                    <p className="grow">{contact.NameFormattedName ?? contact.NameFirstName}</p>
                    <button className="button button--primary">
                      <UserPlusIcon className="h-6 w-6" />
                    </button>
                  </div>
                ))}
              </div>

            </li>
          )}

          {message.Payload.MessageType === 'image' && (
            <MessageBoxImage payload={message.Payload} timestamp={message.Timestamp} />
          )}

          {message.Payload.MessageType === "audio" && (
            <MessageBoxAudio payload={message.Payload} timestamp={message.Timestamp} />
          )}

        </>
      )}
    </>
  )
}


