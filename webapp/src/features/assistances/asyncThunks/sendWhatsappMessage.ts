import { createAsyncThunk } from "@reduxjs/toolkit"
import { API } from "aws-amplify"

import { RootState } from "../../../store"
import { composeKey } from "../../../helpers"


/**
 * Send whatsapp message action
 */
export const sendWhatsappMessage = createAsyncThunk(
  "assistances/sendWhatsappMessage",

  async (message: string, thunkAPI): Promise<Record<string, AssistanceMessageEvent>> => {
    const state = thunkAPI.getState() as RootState
    const customerKey = state.assistances.ui.activeCustomer

    // validate input fields
    if (!message)
      throw new Error("O campo mensagem precisa ser fornecido!", {
        cause: { code: "NonNullable", values: ["message"] }
      })

    const data = await API.post("WhatsappApi", "/whatsapp/101200309605682/messages", {
      headers: { "Content-Type": "application/json" },
      body: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: customerKey,
        type: "text",
        text: {
          preview_url: false,
          body: message
        }
      }
    }) as AssistanceMessageEvent[]

    const messagesById = data.reduce((acc, cur) => (acc[composeKey(cur)] = cur, acc), {} as Record<string, AssistanceMessageEvent>)

    return messagesById
  }
)
