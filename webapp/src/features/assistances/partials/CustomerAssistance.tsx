import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowUturnLeftIcon, UserIcon } from "@heroicons/react/20/solid"

import personPlaceholder from '../../../assets/images/avatar.png'
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks"
import Chat from "./Chat"
import { fetchPersonalData } from "../../personalData/asyncThunks"
import { selectPersonalDataContactName } from "../../personalData/personalDataSlice"
import { selectActiveCustomer, selectLastMessage, selectMyOpenTicket, selectTicketById, selectTickets, selectUnreadedMessages, setCustomer } from "../selectors"
import { fetchAssistanceTickets, markMessagesAsRead } from "../asyncThunks"
import { partialRight } from "../../../helpers"
import TicketRow from "./TicketRow"
import { clearCustomer } from "../assistancesSlice"

export default function CustomerAssistance() {

  const { PartitionKey } = useParams()

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const tickets = useAppSelector(selectTickets)
  const customerKey = useAppSelector(selectActiveCustomer)
  const lastMessage = useAppSelector(selectLastMessage)
  const openAssistance = useAppSelector(selectMyOpenTicket)
  const openTicket = useAppSelector(partialRight(selectTicketById, openAssistance))
  const unreadMessages = useAppSelector(partialRight(selectUnreadedMessages, openAssistance))

  const customerName = useAppSelector(partialRight(selectPersonalDataContactName, customerKey))

  const [detailsMenuOpen, setDetailsMenuOpen] = useState<boolean>(false)

  useEffect(() => { PartitionKey && dispatch(setCustomer(PartitionKey)) }, [PartitionKey])
  useEffect(() => {
    if (!customerKey) return

    const fetchTicketPromise = dispatch(fetchAssistanceTickets(customerKey))
    const fetchPDataPromise = dispatch(fetchPersonalData(customerKey))

    return () => {
      fetchTicketPromise.abort()
      fetchPDataPromise.abort()
    }
  }, [customerKey])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (openTicket && (unreadMessages > 0) && lastMessage && openAssistance) {
        dispatch(markMessagesAsRead({
          messageId: lastMessage,
          partitionKey: openTicket.PartitionKey,
          sortKey: openTicket.SortKey,
        }))
      }
    }, 4000)
    return () => clearTimeout(timer)
  }, [openAssistance, lastMessage, unreadMessages])


  const closeCustomerPanelHandler = () => {
    navigate("/assistances")
    dispatch(clearCustomer())
  }

  return (
    <>

      <div className="customer-panel__top-menu">
        <button onClick={closeCustomerPanelHandler}>
          <ArrowUturnLeftIcon className="menu-icon" />
        </button>
        <button className="2xl:hidden" onClick={() => setDetailsMenuOpen(!detailsMenuOpen)}>
          <UserIcon className="menu-icon" />
        </button>
      </div>

      <div className="customer-panel__content">

        <Chat customerKey={customerKey} className="grow" />

        {/* deteils / actions */}
        <div className={`bg-neutral-100 absolute top-0 bottom-0 right-0 overflow-auto dark:bg-neutral-800 z-20 md:z-0 md:relative md:top-auto 2xl:w-[45%] transition-all duration-300 ${detailsMenuOpen ? "w-full md:w-[400px]" : "w-0"}`} >
          <div className="px-5 md:w-[400px] 2xl:w-full">
            <button className="md:hidden" onClick={() => setDetailsMenuOpen(false)}>close</button>
            <img src={personPlaceholder} alt="photo" className="w-36 rounded-md mx-auto mt-14 mb-8" />
            <h2 className="font-bold text-2xl mb-10 text-center">
              {customerName ?? customerKey}
            </h2>
            <div className="overflow-x-auto shadow-sm m-5 max-h-[50vh] ">
              <table className="w-full border-collapse bg-neutral-50 dark:bg-neutral-900 text-left text-sm ">
                <thead className="bg-neutral-200 dark:bg-neutral-700">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-medium text-neutral-700 dark:text-neutral-200"></th>
                    <th scope="col" className="px-6 py-4 font-medium text-neutral-700 dark:text-neutral-200">Atendente</th>
                    <th scope="col" className="px-6 py-4 font-medium text-neutral-700 dark:text-neutral-200">Início</th>
                    <th scope="col" className="px-6 py-4 font-medium text-neutral-700 dark:text-neutral-200">Término</th>
                    <th scope="col" className="px-6 py-4 font-medium text-neutral-700 dark:text-neutral-200"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 border-t border-neutral-100 dark:border-neutral-600">
                  {tickets.map((ticket) => (
                    <TicketRow key={ticket} ticketId={ticket} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

    </>
  )
}