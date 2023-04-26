import { useNavigate, useParams } from "react-router-dom"
import { XMarkIcon, HandRaisedIcon } from "@heroicons/react/20/solid"
import { ChevronDownIcon, TicketIcon } from "@heroicons/react/24/outline"
import personPlaceholder from '../../assets/images/avatar.png'
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks"
import { useEffect, useState } from "react"
import { AssistanceItem, AssistanceKey } from "../../@types/app"
import { fetchMessages, selectTickets, startAssistance } from "./messagesSlice"
import { selectHash } from "./assistancesSlice"

export default function Messages() {

  const { PartitionKey } = useParams()
  const navigate = useNavigate()
  const hash = useAppSelector(selectHash)
  const tickets = useAppSelector(selectTickets)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (PartitionKey)
      dispatch(fetchMessages(PartitionKey))
  }, [PartitionKey])

  const startAssistaceHandler = (key: AssistanceKey) => {
    dispatch(startAssistance(key))
  }

  return (
    <section className="flex flex-col h-full">

      <div className=" p-5 mb-2">
        <button onClick={() => navigate("/assistances")}>
          <XMarkIcon className="w-6 h-6 hover:text-primary" />
        </button>
      </div>

      <div className="grow flex flex-row px-2 gap-2">

        {/* chat */}
        <div className="w-1/2 flex flex-col gap-3 justify-end bg-pattern bg-white py-3 px-2">
          <div className="px-10 py-5 bg-gray-200 w-2/3 rounded-b-2xl rounded-tr-2xl">dfsafas</div>
          <div className="px-10 py-5 bg-primary w-2/3 rounded-b-2xl rounded-tl-2xl text-white self-end text-right">fdsafasd</div>
        </div>

        {/* deteils / actions */}
        <div className="w-1/2 px-7">

          <img src={personPlaceholder} alt="photo" className="w-36 rounded-full mx-auto mt-14 mb-8" />
          <h2 className="font-bold text-2xl mb-10 text-center">John Doe</h2>
          <button className="flex flex-row w-full items-center justify-between py-3 mb-2" onClick={() => { }}>
            <h2 className="font-semibold tracking-wide font-sans text-slate-400 uppercase px-2">
              Atendimentos
            </h2>
            <ChevronDownIcon className={`w-5 transition-all duration-500 ease-in-out ${false ? "rotate-90" : ""}`} />
          </button>
          <ul>
            {tickets.map((ticket) => (
              <li className="flex flex-row gap-3 items-center justify-between p-3 mb-2" key={ticket}>
                <TicketIcon className="w-10" />
                <span className="grow">{hash[ticket].SortKey}</span>
                {("Attendent" in hash[ticket]) ? (
                  <button className="flex flex-row gap-2 items-center px-3 py-2 bg-gray-200 rounded-md">
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                ) : (
                  <button className="flex flex-row gap-2 items-center px-3 py-2 bg-gray-200 rounded-md" onClick={() => startAssistaceHandler(hash[ticket])}>
                    <HandRaisedIcon className="h-5 w-5" />
                  </button>
                )}
              </li>
            ))}
            {/* <li className="flex flex-row gap-3 items-center justify-between p-3 mb-2">
              <TicketIcon className="w-10" />
              <span className="grow">{SortKey}</span>
              <button className="flex flex-row gap-2 items-center px-3 py-2 bg-gray-200 rounded-md">
                {(ticket && ("Attendent" in ticket)) ? (
                  <XMarkIcon className="h-5 w-5" />
                ) : (
                  <HandRaisedIcon className="h-5 w-5" />
                )}
              </button>
            </li> */}
          </ul>
        </div>
      </div>

    </section >
  )
}