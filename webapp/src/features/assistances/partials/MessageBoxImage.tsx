import { useEffect, useRef } from "react";
import { partialRight, toLocaleTimeString } from "../../../helpers";
import { selectActiveCustomer } from "../selectors";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks";
import { fetchPresignedUrl } from "../../storage/asyncThunks/fetchPresignedUrl";
import useIsVisible from "../../../hooks/useIsVisible";
import { selectStorageDataByKey } from "../../storage/storageSlice";

interface Props {
  payload: AssistanceImageMessagePayload
  timestamp: number
}

export default function MessageBoxImage({ payload, timestamp }: Props): JSX.Element {

  const dispatch = useAppDispatch()
  const customerKey = useAppSelector(selectActiveCustomer)
  const ref = useRef<HTMLLIElement>(null)
  const isVisible = useIsVisible<HTMLLIElement>(ref)

  const mimeType = payload.ImageMimeType.split(";")[0]
  const extension = mimeType.split("/").at(-1)

  const { value: imageUrl, state, error } =
    useAppSelector(partialRight(selectStorageDataByKey, 'protected', `${payload.ImageId}.${extension}`)) || {}

  useEffect(() => {
    if (customerKey)
      // fetching image
      dispatch(fetchPresignedUrl({
        key: `${payload.ImageId}.${extension}`,
        config: { level: 'protected', identityId: customerKey }
      }))


  }, [customerKey])

  return (
    <li className="message-box message-box--left" ref={ref}>
      <span className="message-box__arrow"></span>
      <div className="message-box__details">
        <span>{toLocaleTimeString(timestamp)}</span>
        <span>({payload.NotificationContact?.ProfileName})</span>
      </div>

      <div className="flex flex-col mt-5">
        {(imageUrl || isVisible) && (
          <img src={imageUrl} alt="Imagem" className="max-w-sm" />
        )}
      </div>

    </li>
  )
}