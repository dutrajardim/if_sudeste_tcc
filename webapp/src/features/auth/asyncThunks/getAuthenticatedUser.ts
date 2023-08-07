import { createAsyncThunk } from "@reduxjs/toolkit";
import { Auth } from "aws-amplify";

/**
 *  Get Authenticated User Action
 */
export const getAuthenticatedUser = createAsyncThunk("auth/getAuthenticatedUser", async () =>
  await Auth.currentAuthenticatedUser())