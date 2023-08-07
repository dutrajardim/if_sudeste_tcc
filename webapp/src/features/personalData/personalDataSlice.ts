import { createSelector, createSlice } from "@reduxjs/toolkit";

import { fetchPersonalData } from "./asyncThunks/fetchPersonalData";
import type { RootState } from "../../store";

// defining the initial state
const initialState: PersonalDataInitialState = {
  data: {},
  fetchPersonalData: {
    state: "idle",
    error: {}
  }
}

// creating the slice 
export const personalDataSlice = createSlice({
  name: "personalData",
  initialState,
  reducers: {
    putPersonalData: (state, action) => {
      state.data = { ...state.data, ...action.payload }
    }
  },
  extraReducers: (builder) => {
    // --- Fetch personal data

    // fulfilled
    builder.addCase(fetchPersonalData.fulfilled, (state, action) => {
      state.fetchPersonalData.state = "fulfilled"
      state.data = { ...state.data, ...action.payload }
    })

    // rejected
    builder.addCase(fetchPersonalData.rejected, (state, action) => {
      state.fetchPersonalData.state = "rejected"
      state.fetchPersonalData.error = action.error
    })

    // pending
    builder.addCase(fetchPersonalData.pending, (state, action) => {
      state.fetchPersonalData.state = "pending"
      state.data = {}
    })
  }
})

export default personalDataSlice.reducer

export const { putPersonalData } = personalDataSlice.actions

const getPersonalData = (state: RootState): Partial<PersonalData> => state.personalData.data

export const selectPersonalDataContactName =
  createSelector(getPersonalData, (data) => data["contact#telephones"]?.Data)
