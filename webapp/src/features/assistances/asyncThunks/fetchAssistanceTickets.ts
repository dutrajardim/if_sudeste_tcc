import { createAsyncThunk } from "@reduxjs/toolkit"
import { API, Cache } from "aws-amplify"

import { composeKey } from "../../../helpers"

const fetchAssistanceTicketsName = "assistances/fetchAssistanceTickets"

/**
 * Fetch assistance item action
 */
export const fetchAssistanceTickets = createAsyncThunk(
  fetchAssistanceTicketsName,

  async (partitionKey: string, thunkAPI): Promise<Record<string, AssistanceTicket>> => {
    // return {}
    const cacheKey = `${fetchAssistanceTicketsName}#${partitionKey}`
    const from = Cache.getItem(`${cacheKey}-last`)

    const data = await API.get("AssistancesApi", `/assistances/${partitionKey}`, { queryStringParameters: { from } }) as { Items: DbKey[] }

    const dataById = data.Items.reduce((acc, cur) => (acc[composeKey(cur)] = cur, acc), {} as Record<string, any>)
    return dataById
  }
)
