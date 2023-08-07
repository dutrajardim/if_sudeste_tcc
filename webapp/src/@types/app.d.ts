interface AsyncThunkState {
  state: "idle" | "pending" | "fulfilled" | "rejected"
  error: any
}

interface DbKey {
  PartitionKey: string
  SortKey: string
}

interface AWSTranscription {
  jobName: string
  accountId: string
  results: {
    transcripts: {
      transcript: string
    }[]
    items: {
      start_time: string,
      end_time: string
      alternatives: {
        confidence: string,
        content: string
      }[]
      type: string
    }[]
  }
  status: string
}