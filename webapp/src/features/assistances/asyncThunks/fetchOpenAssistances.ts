import { createAsyncThunk } from "@reduxjs/toolkit"
import { API } from "aws-amplify"
import { composeKey } from "../../../helpers"

/**
 * Fetch open assistances action
 */
export const fetchOpenAssistances = createAsyncThunk(
  "assistances/fetchOpenAssistances",

  async () => {

    const data = await API.get("AssistancesApi", "/assistances", {}) as { Items: AssistanceTicket[] }

    const hash = data.Items.reduce((acc, cur) => (acc[composeKey(cur)] = cur, acc), {} as Record<string, AssistanceTicket>)

    localStorage.setItem("openAssistances", JSON.stringify(hash))

    // const hash = JSON.parse(localStorage.getItem("openAssistances") || '{}')

    return hash
  }

)