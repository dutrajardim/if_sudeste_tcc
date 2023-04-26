//@types.template.ts

import { ReactNode } from "react"

// define a type for assistance key
interface AssistanceKey {
  PartitionKey: string
  SortKey: string
}

interface User {
  Username: string,
  Name?: string,
  Email?: string,
  PhoneNumber?: string
}

interface Attendent extends User { }

// define a type for assistance item
interface AssistanceItem extends AssistanceKey {
  CreatedAt: number
  Unreaded: number
  Attendent?: Attendent
  ClosedAt?: number
  OpenAssistance?: string
}

interface Credentials {
  username: string
  password: string
}

interface NewPasswordChallengePayload {
  newPassword: string
  requiredAttributes: Record<string, string>
}