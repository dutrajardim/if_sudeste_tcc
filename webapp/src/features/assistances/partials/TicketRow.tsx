import { HandRaisedIcon, XMarkIcon } from "@heroicons/react/20/solid"
import { TicketIcon } from "@heroicons/react/24/outline"

import { partialRight, toLocaleDateString } from "../../../helpers"
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks"
import { closeAssistance, startAssistance } from "../asyncThunks"
import { selectIsMyTicket, selectIsOpenTicket, selectIsPending, selectTicketById } from "../selectors"

interface Props {
  ticketId: string
}

export default function TicketRow({ ticketId }: Props): JSX.Element {

  const dispatch = useAppDispatch()

  const ticket = useAppSelector(partialRight(selectTicketById, ticketId))

  const isOpen = useAppSelector(partialRight(selectIsOpenTicket, ticketId))
  const isPending = useAppSelector(partialRight(selectIsPending, ticketId))
  const isMine = useAppSelector(partialRight(selectIsMyTicket, ticketId))

  const startAssistaceHandler = (key?: DbKey) => key && dispatch(startAssistance(key))
  const closeAssistanceHandler = (key?: DbKey) => key && dispatch(closeAssistance(key))

  return (
    <tr className="hover:bg-neutral-200 dark:hover:bg-neutral-800">

      <td className="px-6 py-4"><TicketIcon className="w-6" /></td>
      <td className="px-6 py-4">{ticket.Attendent?.Name}</td>
      <td className="px-6 py-4">{toLocaleDateString(ticket?.CreatedAt)}</td>
      <td className="px-6 py-4">{toLocaleDateString(ticket?.ClosedAt)}</td>
      <td className="px-6 py-4">
        {(isOpen && isMine) && (
          <button className="button button--primary button--outline mx-auto" onClick={() => closeAssistanceHandler(ticket)}>
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
        {isPending && (
          <button className="button button--secondary button--outline mx-auto" onClick={() => startAssistaceHandler(ticket)}>
            <HandRaisedIcon className="h-5 w-5" />
          </button>
        )}
      </td>
    </tr>
  )
}