import { createAsyncThunk } from "@reduxjs/toolkit";
import { Storage } from "aws-amplify";
import type { StorageGetConfig } from "@aws-amplify/storage"

interface FetchJsonInput {
  key: string,
  config: StorageGetConfig<Record<string, any>>
}

export const fetchJson = createAsyncThunk(
  "storage/fetchJson",

  async ({ key, config }: FetchJsonInput) => {
    const response = await Storage.get(key, {
      ...config,
      download: true
    })

    return await (response.Body as Blob).text()
  }
)