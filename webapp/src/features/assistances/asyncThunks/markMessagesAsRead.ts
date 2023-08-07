import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "aws-amplify";

interface MarkMessagesAsReadInput {
  messageId: string
  partitionKey: string
  sortKey: string
}

/**
 * Mark messages as read action
 */
export const markMessagesAsRead = createAsyncThunk(
  "assistances/markMessagesAsRead",

  async ({ messageId, partitionKey, sortKey }: MarkMessagesAsReadInput) => {
    return await API.patch('WhatsappApi', "/whatsapp/101200309605682/messages", {
      headers: { "Content-Type": "application/json" },
      body: {
        messageId,
        partitionKey,
        sortKey
      }
    })
  }
)