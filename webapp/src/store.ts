import { configureStore } from "@reduxjs/toolkit"
import assistancesReducer from "./features/assistances/assistancesSlice"
import userReducer from "./features/users/userSlice"
import assistanceMessagesReducer from "./features/assistances/messagesSlice"



const store = configureStore({
  reducer: {
    assistances: assistancesReducer,
    assistanceMessages: assistanceMessagesReducer,
    user: userReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store