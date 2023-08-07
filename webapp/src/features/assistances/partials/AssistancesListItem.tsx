
import { Link } from 'react-router-dom'
import personPlaceholder from '../../../assets/images/avatar.png'
import { formatTelephone, partialRight, timeSince } from "../../../helpers"
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectOpenAssistanceById } from '../selectors'

interface Props {
  imageSrc?: string
  assistanceId: string
}

export default function AssistancesListItem({ imageSrc, assistanceId }: Props) {

  const [time, setTime] = useState<string>('')
  const image = imageSrc || personPlaceholder

  const assistance = useSelector(partialRight(selectOpenAssistanceById, assistanceId))

  useEffect(() => {
    setTime(timeSince(assistance.CreatedAt))

    const timer = setInterval(() => {
      setTime(timeSince(assistance.CreatedAt))
    }, 30000)

    return () => clearInterval(timer)
  }, [])

  return (
    <li className='assistances-list__item'>
      <Link to={assistance.PartitionKey}>
        <div>
          <img src={image} alt="person image" />
          <div>
            <span className="assistances-list__item-name truncate">{assistance.ProfileName ?? formatTelephone(assistance.PartitionKey)}</span>
            <span className="assistances-list__item-time">{time}</span>
          </div>
          <span className="badge">{assistance.Unreaded ?? 0}</span>
        </div>
      </Link>
    </li>
  )
}