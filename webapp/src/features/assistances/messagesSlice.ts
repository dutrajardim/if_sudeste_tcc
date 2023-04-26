import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API } from "aws-amplify";
import { RootState } from "../../store";
import { AssistanceItem, AssistanceKey } from "../../@types/app";
import { composeKey } from "../../helpers";

// defining a type for the slice state
interface AssistanceMessagesState {
  hash: Record<string, any>
  tickets: string[]
  isFetching: boolean,
  error: any
}

// defining the initial state
const initialState = {
  hash: {},
  tickets: [],
  isFetching: false,
  error: null
} as AssistanceMessagesState

// async actions

export const fetchMessages = createAsyncThunk("messages/fetch", async (partitionKey: string) => await API.get("AssistancesApi", `/assistances/${partitionKey}`, {}))

export const startAssistance = createAsyncThunk("messages/startAssistance", async (key: AssistanceKey) => {
  const data = await API.patch("AssistancesApi", `/assistances/${key.PartitionKey}/${key.SortKey}/start`, { "Content-Type": "application/json" })

  console.log(data)
})

// helpers

// predicate for filtering tickets
const isATicketPredicate = ({ SortKey }: AssistanceKey) => SortKey.endsWith("-ticket")
// predicate for sort assistances by creation timestamp 
const byCreatedAtPredicate = (a: AssistanceKey, b: AssistanceKey) => (a as AssistanceItem).CreatedAt - (b as AssistanceItem).CreatedAt

export const assistanceMessagesSlice = createSlice({
  name: "assistanceMessages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.pending, (state) => {
      state.isFetching = true
      state.error = null
    })

    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.isFetching = false

      const payload = action.payload as { Items: AssistanceKey[] }

      // create a dictionary of the items
      state.hash = payload.Items.reduce((acc, cur) => (acc[composeKey(cur)] = cur, acc), {} as Record<string, any>)
      // create a list of the tickets
      state.tickets = payload.Items.filter(isATicketPredicate).sort(byCreatedAtPredicate).map(composeKey)
    })

    builder.addCase(fetchMessages.rejected, (state, action) => {
      state.isFetching = false
      console.log(action.error)
    })
  }
})

// exporting selectors
export const selectHash = (state: RootState) => state.assistanceMessages.hash
export const selectIsFetching = (state: RootState) => state.assistanceMessages.isFetching
export const selectError = (state: RootState) => state.assistanceMessages.error
export const selectTickets = (state: RootState) => state.assistanceMessages.tickets

// exporting the the reducer
export default assistanceMessagesSlice.reducer