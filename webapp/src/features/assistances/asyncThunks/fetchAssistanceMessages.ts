import { createAsyncThunk } from "@reduxjs/toolkit"
import { API, Cache } from "aws-amplify"

import { composeKey } from "../../../helpers"

const fetchAssistanceMessagesName = "assistances/fetchAssistanceMessages"

/**
 * Fetch assistance item action
 */
export const fetchAssistanceMessages = createAsyncThunk(
  fetchAssistanceMessagesName,

  async (partitionKey: string, thunkAPI): Promise<Record<string, AssistanceMessageEvent>> => {
    // return {}
    const cacheKey = `${fetchAssistanceMessagesName}#${partitionKey}`
    const from = Cache.getItem(`${cacheKey}-last`)

    const data = await API.get("WhatsappApi", `/whatsapp/${partitionKey}/messages`, { queryStringParameters: { from } }) as { Items: DbKey[] }

    const dataById = data.Items.reduce((acc, cur) => (acc[composeKey(cur)] = cur, acc), {} as Record<string, any>)
    return dataById
  }
)
