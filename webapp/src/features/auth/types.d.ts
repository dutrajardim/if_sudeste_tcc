interface AuthenticatedUser {
  Username: string,
  Name?: string,
  Email?: string,
  PhoneNumber?: string
}

interface AuthInitialState {
  user: AuthenticatedUser | null
  signIn: AsyncThunkState
  completeChallenge: AsyncThunkState & {
    challenge: any
  }
  signOut: AsyncThunkState
  getAuthenticatedUser: AsyncThunkState
}