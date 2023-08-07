import { configureStore } from "@reduxjs/toolkit"

import authReducer from "./features/auth/authSlice"
import websocketReducer from "./features/websocket/websocketSlice"
import assistancesReducer from "./features/assistances/assistancesSlice"
import layoutReducer from "./features/layout/layoutSlice"
import personalDataReducer from "./features/personalData/personalDataSlice"
import storageReducer from "./features/storage/storageSlice"

import listenerMiddleware from "./listenerMiddleware"

const store = configureStore({
  reducer: {
    assistances: assistancesReducer,
    auth: authReducer,
    websocket: websocketReducer,
    layout: layoutReducer,
    personalData: personalDataReducer,
    storage: storageReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      listenerMiddleware
    )
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store