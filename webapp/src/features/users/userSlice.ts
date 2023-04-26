import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Credentials, NewPasswordChallengePayload, User } from "../../@types/app"
import { Auth } from "aws-amplify"
import { RootState } from "../../store"

// define a type for the slice state
interface UserState {
  user: any
  loggedInUser: User | null
  loginPending: boolean
  loginError: any
  logoutPending: boolean
  logoutError: any
}

// define the initial state
const initialState = {
  user: null,
  loggedInUser: null,
  loginPending: false,
  loginError: null,
  logoutPending: false,
  logoutError: null
} as UserState


// asyn actions
export const signIn = createAsyncThunk("user/signIn", async (credentials: Credentials) => {
  const { username, attributes, challengeName, challengePram } = await Auth.signIn(credentials.username, credentials.password)
  return ({ username, attributes, challengeName, challengePram })
})

export const completeNewPasswordChallenge = createAsyncThunk("user/newPasswordChallenge", async (newPasswordChallenge: NewPasswordChallengePayload, thunkAPI) => {
  const state = thunkAPI.getState() as RootState
  const { newPassword, requiredAttributes } = newPasswordChallenge

  const { username, attributes } = await Auth.completeNewPassword(state.user.user, newPassword, requiredAttributes)
  return ({ username, attributes })
})

export const signOut = createAsyncThunk("user/signOut", async () => {
  await Auth.signOut()
  return true
})

export const getUser = createAsyncThunk("user/getUser", async () => {
  const { username, attributes } = await Auth.currentAuthenticatedUser()
  return { username, attributes }
})

// creating the slice
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    // signIn fulfilled
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.loginPending = false

      // if new password is required set challenge state
      if (action.payload?.challengeName === "NEW_PASSWORD_REQUIRED")
        state.user = action.payload
      // new password is not required
      else {
        // setting logged in user
        state.loggedInUser = {
          Username: action.payload.username,
          Email: action.payload.attributes.email,
          Name: action.payload.attributes.name,
          PhoneNumber: action.payload.attributes.phone_number
        }
      }
    })

    // completeNewPasswordChallenge fulfilled
    builder.addCase(completeNewPasswordChallenge.fulfilled, (state, action) => {
      state.loginPending = false
      // clear challenges state
      state.user = null

      // setting logged in user
      state.loggedInUser = {
        Username: action.payload.username,
        Email: action.payload.attributes.email,
        Name: action.payload.attributes.name,
        PhoneNumber: action.payload.attributes.phone_number
      }
    })

    builder.addCase(getUser.fulfilled, (state, action) => {
      state.loggedInUser = {
        Username: action.payload.username,
        Email: action.payload.attributes.email,
        Name: action.payload.attributes.name,
        PhoneNumber: action.payload.attributes.phone_number
      }
    })

    builder.addCase(signOut.pending, (state) => {
      state.logoutPending = true
      state.logoutError = null // clear logout error
    })

    builder.addCase(signOut.rejected, (state, action) => {
      state.logoutPending = false
      state.logoutError = action.error // setting error state
    })

    builder.addCase(signOut.fulfilled, (state) => {
      state.logoutPending = false
      state.loggedInUser = null
    })

    // signIn or completeNewPasswordChallenge pending
    builder
      .addMatcher(
        ({ type }) => [signIn.pending.type, completeNewPasswordChallenge.pending.type].includes(type),
        (state) => {
          state.loginPending = true
          state.loginError = null // clear login error
        })

    // siginIn or complete challenge rejected
    builder
      .addMatcher(
        ({ type }) => [signIn.rejected.type, completeNewPasswordChallenge.rejected.type].includes(type),
        (state, action) => {
          state.loginPending = false
          state.loginError = action.error // setting error state
        })

  }
})

// exporting selectors
export const selectLoggedInUser = (state: any) => state.user.loggedInUser
export const selectLoginPending = (state: any) => state.user.loginPending
export const selectLoginError = (state: any) => state.user.loginError
export const selectChallengeName = (state: any) => state.user.user?.challengeName
export const selectRequiredAttributes = (state: any) => state.user.user?.challengePram?.requiredAttributes
export const selectLogoutPending = (state: any) => state.user.logoutPending
export const selectLogoutError = (state: any) => state.user.logoutError

// exporting reducer
export default userSlice.reducer