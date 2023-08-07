import { createSelector, createSlice } from "@reduxjs/toolkit";
import { fetchJson } from "./asyncThunks/fetchJson";
import { StorageInitialState } from "./types";
import { fetchPresignedUrl } from "./asyncThunks/fetchPresignedUrl";
import { RootState } from "../../store";
import { StorageAccessLevel } from "@aws-amplify/storage";

const initialState: StorageInitialState = {
  data: {
    protected: {},
    private: {},
    public: {}
  }
}

export const storageSlice = createSlice({
  name: 'storage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    // --- Fetch Json action

    // fulfulled
    builder.addCase(fetchJson.fulfilled, (state, action) => {
      const { key, config } = action.meta.arg
      const level = config?.level ?? 'public'

      state.data[level][key] = {
        state: "fulfilled",
        value: action.payload,
        error: null
      }
    })

    // rejected
    builder.addCase(fetchJson.rejected, (state, action) => {
      const { key, config } = action.meta.arg
      const level = config?.level ?? 'public'

      state.data[level][key] = {
        ...state.data[level][key],
        state: "rejected",
        error: action.error,
      }
    })

    // pending
    builder.addCase(fetchJson.pending, (state, action) => {
      const { key, config } = action.meta.arg
      const level = config?.level ?? 'public'

      state.data[level][key] = {
        state: "pending",
        error: null,
        value: undefined
      }
    })


    // --- Fetch Presigned Url action

    // fulfulled
    builder.addCase(fetchPresignedUrl.fulfilled, (state, action) => {
      const { key, config } = action.meta.arg
      const level = config?.level ?? 'public'

      state.data[level][key] = {
        state: "fulfilled",
        value: action.payload,
        error: null
      }
    })

    // rejected
    builder.addCase(fetchPresignedUrl.rejected, (state, action) => {
      const { key, config } = action.meta.arg
      const level = config?.level ?? 'public'

      state.data[level][key] = {
        ...state.data[level][key],
        state: "rejected",
        error: action.error,
      }
    })

    // pending
    builder.addCase(fetchPresignedUrl.pending, (state, action) => {
      const { key, config } = action.meta.arg
      const level = config?.level ?? 'public'

      state.data[level][key] = {
        state: "pending",
        error: null,
        value: undefined
      }
    })
  }
})


export default storageSlice.reducer

const selectStorageData = (state: RootState) => state.storage.data
const selectByKey = (_: RootState, level: StorageAccessLevel, key: string): [StorageAccessLevel, string] => [level, key]

export const selectStorageDataByKey = createSelector(selectStorageData, selectByKey, (data, [level, key]) => data[level][key])