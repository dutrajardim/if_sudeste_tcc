interface NotificationContact {
  WaId: string
  ProfileName: string
}

interface AssistanceTicket extends DbKey {
  CreatedAt: number
  Unreaded: number
  ProfileName?: string
  Attendent?: AuthenticatedUser
  ClosedAt?: number
  OpenAssistance?: "OPEN"
}

type AssistanceMessageEvent = AssistanceSentMessage | AssistanceMessageStatus | AssistanceReceivedMessage

interface AssistanceSentMessage extends DbKey {
  Timestamp: number
  MessageId: string
  NotificationType: "sent"
  Attendent: AuthenticatedUser
  Payload: {
    TextBody: string
    NotificationContact: NotificationContact
  }
}

interface AssistanceMessageStatus extends DbKey {
  Timestamp: number
  MessageId: string
  NotificationType: "status"
  Payload: {
    Status: string
  }
}

interface AssistanceReceivedMessage extends DbKey {
  Timestamp: number
  MessageId: string
  NotificationType: "message"
  Payload: AssistanceTextMessagePayload | AssistanceContactsMessagePayload | AssistanceImageMessagePayload | AssistanceAudioMessagePayload
}


interface AssistanceTextMessagePayload {
  MessageType: "text"
  NotificationContact: NotificationContact
  TextBody: string
}

interface AssistanceImageMessagePayload {
  MessageType: "image"
  NotificationContact: NotificationContact
  ImageId: string
  ImageMimeType: string
  ImageSha256: string
}

interface AssistanceAudioMessagePayload {
  MessageType: "audio"
  NotificationContact: NotificationContact
  AudioId: string
  AudioMimeType: string
  AudioSha256: string
  AudioVoice: boolean
}

interface AssistanceContactsMessagePayload {
  MessageType: "contacts"
  NotificationContact: NotificationContact
  Contacts: {
    NameFirstName: string
    NameFormattedName: string
    Phones: {
      Phone: string
      Type: string
      WaId: string
    }[]
  }[]
}

interface AssistancesInitialState {
  openAssistancesById: Record<string, AssistanceTicket>
  fetchOpenAssistances: AsyncThunkState
  ticketsById: Record<string, AssistanceTicket>
  fetchAssistanceTickets: AsyncThunkState
  messagesById: Record<string, AssistanceMessage>
  fetchAssistanceMessages: AsyncThunkState
  sendWhatsappMessage: AsyncThunkState
  startAssistance: AsyncThunkState
  closeAssistance: AsyncThunkState
  markMessagesAsRead: AsyncThunkState
  ui: {
    activeCustomer: string | null
  }
}

// this index help organize messages grouping then by id
interface MessageIndex {
  MessageId: string
  Message: AssistanceMessageEvent | null
  Timestamp: number
  Status: AssistanceMessageStatus[]
}