import { createSlice } from "@reduxjs/toolkit"
import { composeKey } from "../../helpers"
import { fetchOpenAssistances, sendWhatsappMessage, fetchAssistanceTickets, markMessagesAsRead, closeAssistance, startAssistance } from "./asyncThunks"
import { fetchAssistanceMessages } from "./asyncThunks/fetchAssistanceMessages"

// defining the initial state
const initialState: AssistancesInitialState = {
  openAssistancesById: {},
  fetchOpenAssistances: { state: 'idle', error: null },
  ticketsById: {},
  fetchAssistanceTickets: { state: 'idle', error: null },
  messagesById: {},
  fetchAssistanceMessages: { state: 'idle', error: null },
  sendWhatsappMessage: { state: 'idle', error: null },
  startAssistance: { state: 'idle', error: null },
  closeAssistance: { state: 'idle', error: null },
  markMessagesAsRead: { state: 'idle', error: null },
  ui: { activeCustomer: null }
}

// defining the slice
export const assistancesSlice = createSlice({
  name: 'assistances',
  initialState,
  reducers: {
    ticketUpdated: (state, action) => {
      const ticket: AssistanceTicket = action.payload

      if (ticket.OpenAssistance === "OPEN")
        state.openAssistancesById[composeKey(ticket)] = ticket
      else
        delete state.openAssistancesById[composeKey(ticket)]

    },
    setCustomer: (state, action) => {
      state.ui.activeCustomer = action.payload
    },
    itemUpdated: (state, action) => {
      const item = action.payload as DbKey
      if (item.PartitionKey === state.ui.activeCustomer) {
        if (item.SortKey.startsWith("ticket"))
          state.ticketsById[composeKey(item)] = item as AssistanceTicket
        else
          state.messagesById[composeKey(item)] = item as AssistanceMessageEvent
      }
    },
    putTickets: (state, action) => {
      state.ticketsById = { ...state.ticketsById, ...action.payload }
    },
    clearCustomer: (state) => {
      state.ui.activeCustomer = null
      state.messagesById = {}
      state.ticketsById = {}
    },
    putMessages: (state, action) => {
      state.messagesById = { ...state.messagesById, ...action.payload }
    }
  },
  extraReducers: (builder) => {

    // --- Fetch open assistances action

    // fulfilled
    builder.addCase(fetchOpenAssistances.fulfilled, (state, action) => {
      state.fetchOpenAssistances.state = 'fulfilled'
      state.openAssistancesById = action.payload
    })

    // rejected
    builder.addCase(fetchOpenAssistances.rejected, (state, action) => {
      state.fetchOpenAssistances.state = 'rejected'
      state.fetchOpenAssistances.error = action.error
    })

    // pending
    builder.addCase(fetchOpenAssistances.pending, (state) => {
      state.fetchOpenAssistances.state = 'pending'
      state.openAssistancesById = {}
    })



    // --- Fetch assistance tickets

    // fulfilled
    builder.addCase(fetchAssistanceTickets.fulfilled, (state, action) => {
      state.fetchAssistanceTickets.state = 'fulfilled'
      state.ticketsById = { ...state.ticketsById, ...action.payload }
    })

    // rejected
    builder.addCase(fetchAssistanceTickets.rejected, (state, action) => {
      state.fetchAssistanceTickets.state = 'rejected'
      state.fetchAssistanceTickets.error = action.error
    })

    // pending
    builder.addCase(fetchAssistanceTickets.pending, (state) => {
      state.fetchAssistanceTickets.state = 'pending'
      state.ticketsById = {}
    })



    // --- Fetch assistance messages

    // fulfilled
    builder.addCase(fetchAssistanceMessages.fulfilled, (state, action) => {
      state.fetchAssistanceMessages.state = 'fulfilled'
      state.messagesById = { ...state.messagesById, ...action.payload }
    })

    // rejected
    builder.addCase(fetchAssistanceMessages.rejected, (state, action) => {
      state.fetchAssistanceMessages.state = 'rejected'
      state.fetchAssistanceMessages.error = action.error
    })

    // pending
    builder.addCase(fetchAssistanceMessages.pending, (state) => {
      state.fetchAssistanceMessages.state = 'pending'
      state.messagesById = {}
    })



    // --- Send whatsapp message action

    // fulfilled
    builder.addCase(sendWhatsappMessage.fulfilled, (state, action) => {
      state.sendWhatsappMessage.state = 'fulfilled'
      // state.assistancesById["message"] = { ...state.assistancesById["message"], ...action.payload }
    })

    // rejected
    builder.addCase(sendWhatsappMessage.rejected, (state, action) => {
      state.sendWhatsappMessage.state = 'rejected'
      state.sendWhatsappMessage.error = action.error
    })

    // pending
    builder.addCase(sendWhatsappMessage.pending, (state) => {
      state.sendWhatsappMessage.state = 'pending'
    })



    // --- Mark messages as read action

    // fulfilled
    builder.addCase(markMessagesAsRead.fulfilled, (state, action) => {
      state.markMessagesAsRead.state = 'fulfilled'
    })

    // rejected
    builder.addCase(markMessagesAsRead.rejected, (state, action) => {
      state.markMessagesAsRead.state = 'rejected'
      state.markMessagesAsRead.error = action.error
    })

    // pending
    builder.addCase(markMessagesAsRead.pending, (state) => {
      state.markMessagesAsRead.state = 'pending'
    })



    // --- Close assistance action

    // fulfilled
    builder.addCase(closeAssistance.fulfilled, (state, action) => {
      state.closeAssistance.state = 'fulfilled'
    })

    // rejected
    builder.addCase(closeAssistance.rejected, (state, action) => {
      state.closeAssistance.state = 'rejected'
      state.closeAssistance.error = action.error
    })

    // pending
    builder.addCase(closeAssistance.pending, (state) => {
      state.closeAssistance.state = 'pending'
    })



    // --- Start assistance action

    // fulfilled
    builder.addCase(startAssistance.fulfilled, (state, action) => {
      state.startAssistance.state = 'fulfilled'
    })

    // rejected
    builder.addCase(startAssistance.rejected, (state, action) => {
      state.startAssistance.state = 'rejected'
      state.startAssistance.error = action.error
    })

    // pending
    builder.addCase(startAssistance.pending, (state) => {
      state.startAssistance.state = 'pending'
    })

  }
})

// exporting actions
export const { ticketUpdated, itemUpdated, setCustomer, putTickets, putMessages, clearCustomer } = assistancesSlice.actions

// exporting reducer
export default assistancesSlice.reducer
