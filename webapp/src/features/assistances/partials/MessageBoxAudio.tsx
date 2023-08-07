import { useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks"
import { selectActiveCustomer } from "../selectors"
import { partialRight, toLocaleTimeString } from "../../../helpers"
import useIsVisible from "../../../hooks/useIsVisible"
import { fetchPresignedUrl } from "../../storage/asyncThunks/fetchPresignedUrl"
import { fetchJson } from "../../storage/asyncThunks/fetchJson"
import { selectStorageDataByKey } from "../../storage/storageSlice"

interface Props {
  payload: AssistanceAudioMessagePayload
  timestamp: number
}

export default function MessageBoxAudio({ payload, timestamp }: Props): JSX.Element {

  const dispatch = useAppDispatch()
  const customerKey = useAppSelector(selectActiveCustomer)
  const ref = useRef<HTMLLIElement>(null)
  const isVisible = useIsVisible<HTMLLIElement>(ref)

  const mimeType = payload.AudioMimeType.split(";")[0]
  const extension = mimeType.split("/").at(-1)

  const { value: mediaUrl, state, error } =
    useAppSelector(partialRight(selectStorageDataByKey, 'protected', `${payload.AudioId}.${extension}`)) || {}

  const { value: transcript, state: transcriptState, error: transcriptError } =
    useAppSelector(partialRight(selectStorageDataByKey, 'protected', `${payload.AudioId}.json`)) || {}

  const transcriptText = (JSON.parse(transcript || '{}') as AWSTranscription)?.results?.transcripts[0]?.transcript

  useEffect(() => {
    if (customerKey) {
      // fetching audio
      dispatch(fetchPresignedUrl({
        key: `${payload.AudioId}.${extension}`,
        config: { level: 'protected', identityId: customerKey }
      }))

      if (isVisible && typeof transcriptText != 'string') {
        // fetching transcription
        dispatch(fetchJson({
          key: `${payload.AudioId}.json`,
          config: { level: 'protected', identityId: customerKey }
        }))
      }

    }
  }, [customerKey, isVisible])

  return (
    <li className="message-box message-box--left" ref={ref}>
      <span className="message-box__arrow"></span>
      <div className="message-box__details">
        <span>{toLocaleTimeString(timestamp)}</span>
        <span>({payload.NotificationContact?.ProfileName})</span>
      </div>

      <div className="flex flex-col mt-5">
        <audio controls src={mediaUrl} >
          <a href={mediaUrl} >Download audio</a>
        </audio>

        <p className="text-md max-w-xs text-center py-5 text-neutral-400">
          {transcriptText}
        </p>
      </div>

    </li>
  )
}