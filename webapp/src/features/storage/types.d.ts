import type { StorageAccessLevel } from "@aws-amplify/storage"

interface StorageData extends AsyncThunkState {
  value?: string
}

interface StorageInitialState {
  data: Record<StorageAccessLevel, Record<string, StorageData>>
}