import { createAsyncThunk } from "@reduxjs/toolkit"
import type { RootState } from "../../../store"
import { Auth } from "aws-amplify"

interface CompleteNewPasswordChallengeInput {
  newPassword: string
  requiredAttributes: Partial<Record<"name" | "phone_number" | "email", string>>
}

/**
 * Complete New Password Challenge Action
 * For details: https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-in
 */
export const completeNewPasswordChallenge = createAsyncThunk(
  "auth/completeNewPasswordChallenge",

  async (input: CompleteNewPasswordChallengeInput, thunkAPI) => {
    const state = thunkAPI.getState() as RootState
    const requiredFields = state.auth.completeChallenge.challenge?.challengeParam?.requiredAttributes || []


    // filter input required attributes by required fields
    const requiredAttributes =
      Object.fromEntries(Object.entries(input.requiredAttributes).filter(([key]) => requiredFields.includes(key)))

    // checking if all required fields are filled in
    const allRequiredFieldsFilledIn = requiredFields.reduce((previous: boolean, field: string) =>
      previous && (field in requiredAttributes) && requiredAttributes[field], true)

    // throw error when fail validation
    if (!(input.newPassword && allRequiredFieldsFilledIn))
      throw new Error("Todos os campos complementares são obrigatórios", {
        cause: { code: "NonNullable", values: ["newPassword", ...requiredFields] }
      })

    // complete challenge
    const { username, challengeParam } =
      await Auth.completeNewPassword(state.auth.completeChallenge.challenge, input.newPassword, requiredAttributes)

    return {
      username,
      attributes: { ...challengeParam.userAttributes }
    }
  }

)