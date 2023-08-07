import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../hooks/storeHooks'
import Collapsable from '../../../components/Collapsable'
import AssistancesListItem from './AssistancesListItem'
import AssistancesListCollapsableToggle from './AssistancesListCollapsableToggle'
import { selectFromOthersInProgressOpenAssistances, selectMyInProgressOpenAssistances, selectPendingOpenAssistances } from '../selectors'
import { fetchOpenAssistances } from '../asyncThunks'

export default function AssistancesList() {

  const pendingAssistances = useAppSelector(selectPendingOpenAssistances)
  const myAssistances = useAppSelector(selectMyInProgressOpenAssistances)
  const fromOthersAssistances = useAppSelector(selectFromOthersInProgressOpenAssistances)

  const dispatch = useAppDispatch()

  const [isUserListOpen, setIsUserListOpen] = useState(true)
  const [isPendingListOpen, setIsPendingListOpen] = useState(true)
  const [isInProgressListOpen, setIsInProgressListOpen] = useState(false)

  useEffect(() => {
    const promise = dispatch(fetchOpenAssistances())
    return () => promise.abort()
  }, [])

  return (
    <>

      {/* logged in user assistances */}
      <AssistancesListCollapsableToggle
        title='Meus atendimentos'
        isOpen={isUserListOpen}
        toggleHandler={() => setIsUserListOpen(!isUserListOpen)}
        messagesQtd={myAssistances.length} />

      <Collapsable collapsed={!isUserListOpen}>
        <ul className="assistances-list__collapsable">
          {myAssistances.map(key => (
            <AssistancesListItem key={key} assistanceId={key} />
          ))}
        </ul>
      </Collapsable>

      {/* pending list */}
      <AssistancesListCollapsableToggle
        title='Aguardando'
        isOpen={isPendingListOpen}
        toggleHandler={() => setIsPendingListOpen(!isPendingListOpen)}
        messagesQtd={pendingAssistances.length} />

      <Collapsable collapsed={!isPendingListOpen}>
        <ul className="assistances-list__collapsable">
          {pendingAssistances.map(key => (
            <AssistancesListItem key={key} assistanceId={key} />
          ))}
        </ul>
      </Collapsable>

      {/* assistances by others */}
      <AssistancesListCollapsableToggle
        title='Em andamento'
        isOpen={isInProgressListOpen}
        toggleHandler={() => setIsInProgressListOpen(!isInProgressListOpen)}
        messagesQtd={fromOthersAssistances.length} />

      <Collapsable collapsed={!isInProgressListOpen}>
        <ul className="assistances-list__collapsable">
          {fromOthersAssistances.map(key => (
            <AssistancesListItem key={key} assistanceId={key} />
          ))}
        </ul>
      </Collapsable>

    </>
  )
}

