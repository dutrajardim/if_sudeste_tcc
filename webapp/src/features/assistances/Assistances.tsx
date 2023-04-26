import { useSelector } from "react-redux"
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks"
import { fetchAssistances, selectHash, selectInProgress, selectIsFetching, selectPending, selectUserAssistances } from "./assistancesSlice"
import { useEffect, useState } from "react"
import LoadingBar from "../../components/LoadingBar"
import { Link, Outlet, useLocation } from "react-router-dom"

import { ChevronDownIcon } from '@heroicons/react/24/outline'
import personPlaceholder from '../../assets/images/avatar.png'
import Sidenav from "../../components/Sidenav"
import LogoIcon from "../../components/LogoIcon"
import Collapsable from "../../components/Collapsable"
import { selectLoggedInUser } from "../users/userSlice"
import { formatTelephone, timeSince } from "../../helpers"

export default function Assistances() {

  // lists
  const inProgressList = useAppSelector(selectInProgress)
  const pendingList = useAppSelector(selectPending)
  const userAssistances = useAppSelector(selectUserAssistances)

  const assistances = useAppSelector(selectHash)
  const loggedInUser = useAppSelector(selectLoggedInUser)
  const assistancesIsFetching = useSelector(selectIsFetching)

  const dispatch = useAppDispatch()
  const location = useLocation()

  const [isUserListOpen, setIsUserListOpen] = useState(true)
  const [isPendingListOpen, setIsPendingListOpen] = useState(true)
  const [isInProgressListOpen, setIsInProgressListOpen] = useState(false)

  useEffect(() => {
    if (loggedInUser)
      dispatch(fetchAssistances())
  }, [loggedInUser])

  return (
    <>
      <LoadingBar loading={assistancesIsFetching} />
      <section className="flex flex-row w-full h-full">

        {/* sidenav */}
        <Sidenav />

        {/* contents */}
        <div className="flex flex-row min-h-screen">

          {/* contacts list */}
          <div className="flex flex-col bg-slate-100 pt-10 px-5 w-[250px]">

            {/* logged in user assistances */}
            <button className="flex flex-row items-center gap-1 justify-start py-3 mt-5 mb-2" onClick={() => setIsUserListOpen(!isUserListOpen)} disabled={userAssistances.length === 0}>
              <span className="bg-slate-50 w-10 py-1 rounded-md text-sm">{userAssistances.length}</span>
              <h2 className="grow font-semibold tracking-wide font-sans text-slate-400 px-2 text-start">
                Meus atendimentos
              </h2>
              {(userAssistances.length !== 0) && (
                <ChevronDownIcon className={`w-5 transition-all duration-500 ease-in-out ${isUserListOpen ? "" : "rotate-90"}`} />
              )}
            </button>
            <Collapsable collapsed={!isUserListOpen}>
              <ul>
                {userAssistances.map(key => (
                  <ContactListItem key={key}
                    documentKey={key}
                    telephone={assistances[key].PartitionKey}
                    unreaded={assistances[key].Unreaded}
                    timestamp={assistances[key].CreatedAt} />
                ))}
              </ul>
            </Collapsable>

            {/* pending list */}
            <button className="flex flex-row items-center gap-1 justify-start py-3 mt-5 mb-2" onClick={() => setIsPendingListOpen(!isPendingListOpen)} disabled={pendingList.length === 0}>
              <span className="bg-slate-50 w-10 py-1 rounded-md text-sm">{pendingList.length}</span>
              <h2 className="grow font-semibold tracking-wide font-sans text-slate-400 px-2 text-start">
                Aguardando
              </h2>
              {(pendingList.length !== 0) && (
                <ChevronDownIcon className={`w-5 transition-all duration-500 ease-in-out ${isPendingListOpen ? "" : "rotate-90"}`} />
              )}
            </button>
            <Collapsable collapsed={!isPendingListOpen}>
              <ul>
                {pendingList.map(key => (
                  <ContactListItem key={key}
                    documentKey={key}
                    telephone={assistances[key].PartitionKey}
                    unreaded={assistances[key].Unreaded}
                    timestamp={assistances[key].CreatedAt} />
                ))}
              </ul>
            </Collapsable>

            <button className="flex flex-row items-center justify-between py-3 mt-5 mb-2" onClick={() => setIsInProgressListOpen(!isInProgressListOpen)} disabled={inProgressList.length === 0}>
              <span className="bg-slate-50 w-10 py-1 rounded-md text-sm">{inProgressList.length}</span>
              <h2 className="grow font-semibold tracking-wide font-sans text-slate-400 px-2 text-start">
                Em andamento
              </h2>
              {(inProgressList.length !== 0) && (
                <ChevronDownIcon className={`w-5 transition-all duration-500 ease-in-out ${isInProgressListOpen ? "" : "rotate-90"}`} />
              )}
            </button>
            <Collapsable collapsed={!isInProgressListOpen}>
              <ul>
                {inProgressList.map(key => (
                  <ContactListItem key={key}
                    documentKey={key}
                    telephone={assistances[key].PartitionKey}
                    unreaded={assistances[key].Unreaded}
                    timestamp={assistances[key].CreatedAt} />
                ))}
              </ul>
            </Collapsable>

          </div>
        </div>

        <div className="grow">
          {location.pathname === "/assistances" ? (

            <div className="flex items-center justify-center h-full">
              <span className="animate-ping absolute inline-flex h-20 w-20 rounded-full bg-sky-400 opacity-75" />
              <LogoIcon className="relative h-20 text-primary" />
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </section>
    </>
  )
}


interface ContactListItemProps {
  imageSrc?: string
  telephone: string
  unreaded: number
  timestamp: number
  documentKey: string
}

function ContactListItem({ imageSrc, telephone, unreaded, timestamp, documentKey }: ContactListItemProps) {

  const image = imageSrc || personPlaceholder

  return (
    <li>
      <Link to={documentKey.split("#")[0]}>
        <div className="flex flex-row items-center hover:bg-slate-200 py-3 px-5 rounded-md">
          <img src={image} alt="person image" className="w-10 rounded-full mr-3" />
          <div className="grow flex flex-col">
            <span className="font-semibold text-slate-700">{formatTelephone(telephone)}</span>
            <span className="text-sm text-slate-500">{timeSince(timestamp)}</span>
          </div>
          <span className="w-7 text-sm h-full text-primary bg-slate-200 rounded-md text-center">{unreaded}</span>
        </div>
      </Link>
    </li>
  )

}