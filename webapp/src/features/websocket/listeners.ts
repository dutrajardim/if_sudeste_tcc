import { websocketEndpoint } from "../../aws-exports"
import { AppStartLitening } from "../../listenerMiddleware"
import { itemUpdated, ticketUpdated } from "../assistances/assistancesSlice"
import { connect, connected, disconnect, disconnected } from "./websocketSlice"

const sockets: Record<channels, WebSocket | null> = {
  assistances: null,
  notifications: null
}

export default function (startListening: AppStartLitening) {

  /**
   *  Connect to websocket
   */
  startListening({
    actionCreator: connect,
    effect: async (action, listenerApi) => {

      const channel = action.payload
      const socket = sockets[channel]

      if (socket && socket.readyState === WebSocket.CLOSED)
        sockets[channel] = null

      if (!socket) {

        let newSocket = new WebSocket(`${websocketEndpoint}?channel=${encodeURI(channel)}`)
        sockets[channel] = newSocket

        newSocket.addEventListener('open', () => {
          listenerApi.dispatch(connected(channel))
        })

        newSocket.addEventListener('close', () => {
          listenerApi.dispatch(disconnected(channel))
        })

        newSocket.addEventListener('message', event => {

          if (channel === 'assistances') {
            const updates = JSON.parse(event.data) as AssistanceTicket[]
            updates.forEach(update => {
              listenerApi.dispatch(ticketUpdated(update))
              listenerApi.dispatch(itemUpdated(update))
            })
          }

          if (channel === "notifications") {
            const updates = JSON.parse(event.data) as AssistanceMessageEvent[]
            updates.forEach(update => {
              listenerApi.dispatch(itemUpdated(update))
            })
          }

        })

      }

    }
  })


  /**
 *  Disconnect to websocket
 */
  startListening({
    actionCreator: disconnect,
    effect: async (action) => {

      const channel = action.payload
      const socket = sockets[channel]

      socket?.close

      if (socket && socket.readyState === WebSocket.CLOSED)
        sockets[channel] = null
    }

  })
}