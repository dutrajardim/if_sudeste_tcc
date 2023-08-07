import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "aws-amplify";

/**
 * Start an asssistance action
 */
export const startAssistance = createAsyncThunk(
  "assistances/startAssistance",

  async (key: DbKey) => {
    return await API.patch("AssistancesApi", `/assistances/${key.PartitionKey}/${encodeURIComponent(key.SortKey)}/start`, {
      headers: { "Content-Type": "application/json" }
    })
  }
)