import { createSlice } from "@reduxjs/toolkit";

import { fetchEmails } from "./asyncThunks/fetchEmails";
export { fetchEmails }

const initialState = {

}

export const emailsSlice = createSlice({
  name: 'emails',
  initialState,
  reducers: {

  },
  extraReducers(builder) {

  }
})


export default emailsSlice.reducer