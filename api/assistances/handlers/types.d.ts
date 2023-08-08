interface EmailModel {
  PartitionKey: string
  SortKey: string
  MessageId?: string
  Timestamp: number
  NotificationType: email
  Payload: {
    FromName: string
    Subject?: string
    To: string[]
    CC?: string[]
    BCC?: string[]
    InReplyTo?: string
    ReplyTo?: string[]
    References?: string[]
  }
}