import { ChevronLeftIcon } from "@heroicons/react/24/outline"

interface Props {
  messagesQtd: number
  title: string
  toggleHandler: () => any
  isOpen: boolean
}

export default function AssistancesListCollapsableToggle({ messagesQtd, toggleHandler, isOpen, title }: Props) {
  return (
    <button className="assistances-list__collapse-toggle" onClick={toggleHandler} disabled={messagesQtd === 0}>
      <div>
        <span className="badge">{messagesQtd}</span>
        <h2>{title}</h2>
      </div>
      {(messagesQtd !== 0) && (
        <ChevronLeftIcon
          className={`assistances-list__collapse-toggle-icon ${isOpen && "assistances-list__collapse-toggle-icon--open"}`} />
      )}
    </button>
  )
}