import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "aws-amplify";

interface FetchEamailsAPIOutput {
  Items: EmailModel[]
  LastEvaluatedKey: Record<string, unknown>
}

export const fetchEmails = createAsyncThunk(
  "expenses/fetchEmails",

  async (exclusiveStartKey: Record<string, unknown> | undefined = undefined): Promise<[Record<string, EmailModel>, Record<string, unknown> | undefined]> => {

    const expenses: FetchEamailsAPIOutput = await API.get("AssistancesApi", "/emails", {
      headers: { "Content-Type": "application/json" },
      queryStringParameters: {
        exclusiveStartKey: JSON.stringify(exclusiveStartKey),
        limit: 20
      }
    })
    console.log(expenses.Items.reduce((acc, cur) => (acc[cur.PartitionKey] = cur, acc), {} as Record<string, EmailModel>))

    return [
      expenses.Items.reduce((acc, cur) => (acc[cur.PartitionKey] = cur, acc), {} as Record<string, EmailModel>),
      expenses.LastEvaluatedKey
    ]
  }
)