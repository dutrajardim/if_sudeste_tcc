import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../../store"
import { API } from "aws-amplify"
import { AssistanceItem, AssistanceKey, User } from "../../@types/app"
import { composeKey } from "../../helpers"

// function getDummyAssistance() {
//   const timestamp = Date.now() - (Math.floor(Math.random() * 4) * 1000 * 60 * 60 * 24)

//   let item = {
//     PartitionKey: '55319' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join(''),
//     SortKey: `${timestamp}-ticket`,
//     Unreaded: Math.floor(Math.random() * 6) + 1,
//     CreatedAt: timestamp,
//     OpenAssistance: 'OPEN'
//   } as AssistanceItem

//   if (Math.floor(Math.random() * 2) === 1) {
//     item.Attendent = (Math.floor(Math.random() * 2) === 1) ? ({
//       Username: "5d36139e-c976-4830-9f08-d5ee7c8a2ca3",
//       Name: "Rafael Dutra Jardim"
//     }) : ({
//       Username: "543d139e-c976-4830-9f08-3234ki8a2ca3",
//       Name: "Julyana Frontelmo Moraes Jardim"
//     })
//   }

//   return item
// }

// define a type for the slice state
interface AssistancesState {
  pending: string[]
  inProgress: string[]
  userAssistances: string[]
  hash: Record<string, AssistanceItem>
  isFetching: boolean
}

// define the initial state
const initialState = {
  pending: [],
  inProgress: [],
  userAssistances: [],
  hash: {},
  isFetching: false
} as AssistancesState

// fetch assistances
export const fetchAssistances = createAsyncThunk("assistances/fetch", async (_, thunkAPI) => {

  const state = thunkAPI.getState() as RootState
  const data = await API.get("AssistancesApi", "/assistances", {})

  // mocking
  // const data = await new Promise(resolve => setTimeout(() => {
  //   resolve({ Items: Array.from({ length: 10 }, () => getDummyAssistance()) })
  // }, 2000)) as { Items: AssistanceItem[] }

  return { ...data, user: state.user.loggedInUser }
})

// helpers

// predicate for sort assistances by creation timestamp 
const byCreatedAtPredicate = (a: AssistanceItem, b: AssistanceItem) => a.CreatedAt - b.CreatedAt
// check if an assistance is in progress and is not in the name of the loggedInUser
const isInProgress = (user: User) => (assistance: AssistanceItem): boolean =>
  ('Attendent' in assistance) && assistance.Attendent?.Username !== user.Username
// check if an assistance is in progress and is in the name of the loggedInUser
const isInProgressUser = (user: User) => (assistance: AssistanceItem): boolean =>
  ('Attendent' in assistance) && assistance.Attendent?.Username === user.Username
// check if an assitance is not in progress
const isNotInProgress = (assistance: AssistanceItem): boolean => !('Attendent' in assistance)


export const assistancesSlice = createSlice({
  name: 'assistances',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAssistances.pending, (state) => { state.isFetching = true })
    builder.addCase(fetchAssistances.fulfilled, (state, action) => {
      state.isFetching = false

      const payload = action.payload as { Items: AssistanceItem[], user: User }

      // create a dictionary of the items
      state.hash = payload.Items.reduce((acc, cur) => (acc[composeKey(cur)] = cur, acc), {} as Record<string, AssistanceItem>)
      // create a list of pending attendances
      state.pending = payload.Items.filter(isNotInProgress).sort(byCreatedAtPredicate).map(composeKey)
      // create a list of inProgress attendances
      state.inProgress = payload.Items.filter(isInProgress(payload.user)).sort(byCreatedAtPredicate).map(composeKey)
      // create a list of current user assistances
      state.userAssistances = payload.Items.filter(isInProgressUser(payload.user)).sort(byCreatedAtPredicate).map(composeKey)

    })
    builder.addCase(fetchAssistances.rejected, (state, action) => {
      state.isFetching = false
      console.log(action.error)
    })
  }
})

// exporting selectors
export const selectPending = (state: RootState) => state.assistances.pending
export const selectInProgress = (state: RootState) => state.assistances.inProgress
export const selectUserAssistances = (state: RootState) => state.assistances.userAssistances
export const selectIsFetching = (state: RootState) => state.assistances.isFetching
export const selectHash = (state: RootState) => state.assistances.hash

// sporting reducer
export default assistancesSlice.reducer