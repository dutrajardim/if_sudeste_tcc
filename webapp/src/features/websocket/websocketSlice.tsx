import { PayloadAction, createSlice } from "@reduxjs/toolkit"

const initialState: WebsocketInitialState = {
  connections: {
    assistances: "disconnected",
    notifications: "disconnected",
  }
}

export const websocketSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {
    connect: (state, action: PayloadAction<channels>) => {
      state.connections[action.payload] = 'connecting'
    },
    disconnect: (state, action: PayloadAction<channels>) => {
      state.connections[action.payload] = 'disconnecting'
    },
    connected: (state, action: PayloadAction<channels>) => {
      state.connections[action.payload] = 'connected'
    },
    disconnected: (state, action: PayloadAction<channels>) => {
      state.connections[action.payload] = 'disconnected'
    }
  },
})

export const { connect, disconnect, connected, disconnected } = websocketSlice.actions

export default websocketSlice.reducer