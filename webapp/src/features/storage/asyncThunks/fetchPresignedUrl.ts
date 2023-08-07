import { createAsyncThunk } from "@reduxjs/toolkit";
import { Storage } from "aws-amplify";
import type { StorageGetConfig } from "@aws-amplify/storage"

interface FetchPresignedUrlInput {
  key: string,
  config: StorageGetConfig<Record<string, any>>
}

export const fetchPresignedUrl = createAsyncThunk(
  "storage/fetchPresignedUrl",

  async ({ key, config }: FetchPresignedUrlInput) => {
    return await Storage.get(key, {
      ...config,
      download: false
    })
  }
)