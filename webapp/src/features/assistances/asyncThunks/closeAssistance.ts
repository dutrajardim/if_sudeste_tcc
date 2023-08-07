import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "aws-amplify";

/**
 * Close assistance action
 */
export const closeAssistance = createAsyncThunk(
  "assistances/closeAssistance",

  async (key: DbKey) => {
    return await API.patch("AssistancesApi", `/assistances/${key.PartitionKey}/${encodeURIComponent(key.SortKey)}/close`, {
      headers: { "Content-Type": "application/json" }
    })
  }
)
