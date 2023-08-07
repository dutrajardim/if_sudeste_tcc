import { createAsyncThunk } from "@reduxjs/toolkit"
import { Auth } from "aws-amplify"


interface SignInInput {
  username: string
  password: string
}


/**
 * Sigin Action
 */
export const signIn = createAsyncThunk(
  "auth/signIn",

  async (credentials: SignInInput) => {
    const { username, password } = credentials

    // validate fields
    if (!(username && password))
      throw new Error("Os campos da credencial são obrigatórios!", {
        cause: { code: "NonNullable", values: ["username", "password"] }
      })

    return await Auth.signIn(username, password)
  }

)