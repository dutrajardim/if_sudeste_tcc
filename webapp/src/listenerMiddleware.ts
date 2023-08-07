import { createListenerMiddleware } from "@reduxjs/toolkit";
import assistancesListener from "./features/assistances/listeners"
import personalDataListener from "./features/personalData/listeners"
import websocketListener from "./features/websocket/listeners"

const listener = createListenerMiddleware()

assistancesListener(listener.startListening)
personalDataListener(listener.startListening)
websocketListener(listener.startListening)

export default listener.middleware
export type AppStartLitening = typeof listener.startListening