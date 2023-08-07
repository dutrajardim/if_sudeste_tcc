type channels = "assistances" | "notifications"
interface WebsocketInitialState {
  connections: Record<channels, "connected" | "disconnected" | "connecting" | "disconnecting">
}
