import { createAsyncThunk } from "@reduxjs/toolkit"
import { Auth } from "aws-amplify"

/**
 * SingOut Action
 */
export const signOut = createAsyncThunk(
  "auth/signOut",

  async () => {
    await Auth.signOut()
    return true
  }

)