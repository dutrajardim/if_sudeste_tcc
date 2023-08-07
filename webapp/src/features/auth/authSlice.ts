import { createSelector, createSlice } from "@reduxjs/toolkit"
import { completeNewPasswordChallenge, signIn, signOut } from "./asyncThunks"
import type { RootState } from "../../store"
import { getAuthenticatedUser } from "./asyncThunks/getAuthenticatedUser"


// defining the initial state
const initialState: AuthInitialState = {
  user: null,
  signIn: {
    state: "idle",
    error: null
  },
  completeChallenge: {
    state: "idle",
    challenge: null,
    error: null
  },
  signOut: {
    state: "idle",
    error: null
  },
  getAuthenticatedUser: {
    state: "idle",
    error: null
  }
}

// creating the slice
export const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    // --- Get Authenticated user

    // fulfilled
    builder.addCase(getAuthenticatedUser.fulfilled, (state, action) => {
      state.getAuthenticatedUser.state = "fulfilled"

      // setting logged in user
      state.user = {
        Username: action.payload.username,
        Email: action.payload.attributes?.email,
        Name: action.payload.attributes?.name,
        PhoneNumber: action.payload.attributes?.phone_number
      }
    })

    // rejected
    builder.addCase(getAuthenticatedUser.rejected, (state, action) => {
      state.getAuthenticatedUser.state = 'rejected'
      state.getAuthenticatedUser.error = action.error
    })

    // pending
    builder.addCase(getAuthenticatedUser.pending, (state) => {
      state.getAuthenticatedUser.state = 'pending'
    })



    // --- Sign in

    // fulfilled 
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.signIn.state = 'fulfilled'

      // if new password is required set challenge state
      if (action.payload?.challengeName === "NEW_PASSWORD_REQUIRED")
        state.completeChallenge.challenge = action.payload

      // if not, setting logged in user
      else {
        state.user = {
          Username: action.payload.username,
          Email: action.payload.attributes?.email,
          Name: action.payload.attributes?.name,
          PhoneNumber: action.payload.attributes?.phone_number
        }
      }
    })

    // rejected
    builder.addCase(signIn.rejected, (state, action) => {
      state.signIn.state = 'rejected'
      state.signIn.error = action.error
    })

    // pending
    builder.addCase(signIn.pending, (state) => {
      state.signIn.state = 'pending'
    })



    // --- Complete new password chellenge

    // fulfilled
    builder.addCase(completeNewPasswordChallenge.fulfilled, (state, action) => {
      state.signIn.state = 'fulfilled'

      // clear challenges state
      state.completeChallenge.challenge = null

      // setting logged in user
      state.user = {
        Username: action.payload.username,
        Email: action.payload.attributes?.email,
        Name: action.payload.attributes?.name,
        PhoneNumber: action.payload.attributes?.phone_number
      }
    })

    // rejected
    builder.addCase(completeNewPasswordChallenge.rejected, (state, action) => {
      state.completeChallenge.state = "rejected"
      state.completeChallenge.error = action.error
    })

    // pending
    builder.addCase(completeNewPasswordChallenge.pending, (state) => {
      state.completeChallenge.state = 'pending'
    })



    // --- Sign Out

    // fulfilled
    builder.addCase(signOut.fulfilled, (state) => {
      state.signOut.state = 'fulfilled'
      state.user = null
    })

    // rejected
    builder.addCase(signOut.rejected, (state, action) => {
      state.signOut.state = 'rejected'
      state.signOut.error = action.error
    })

    // pending
    builder.addCase(signOut.pending, (state) => {
      state.signOut.state = 'pending'
    })

  }
})

// exporting selectors
export const selectAuthenticatedUser = (state: RootState) => state.auth.user

export const selectSignInState = (state: RootState) => state.auth.signIn.state
export const selectSignInError = (state: RootState) => state.auth.signIn.error

export const selectSignOutState = (state: RootState) => state.auth.signOut.state
export const selectSignOutError = (state: RootState) => state.auth.signOut.error

export const selectCompleteChallengeState = (state: RootState) => state.auth.completeChallenge.state
export const selectCompleteChallengeError = (state: RootState) => state.auth.completeChallenge.error

export const selectGetAuthenticatedUserState = (state: RootState) => state.auth.getAuthenticatedUser.state
export const selectGetAuthenticatedUserError = (state: RootState) => state.auth.getAuthenticatedUser.error

const selectChallenge = (state: RootState) => state.auth.completeChallenge.challenge
export const selectChallengeName = createSelector(selectChallenge, challenge => challenge?.challengeName)
export const selectChallengeRequiredAttributes = createSelector(selectChallenge, challenge => challenge?.challengeParam?.requiredAttributes || [])

// exporting reducer
export default userSlice.reducer


