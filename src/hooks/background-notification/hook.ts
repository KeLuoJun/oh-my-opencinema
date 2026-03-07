// Simplified - background notification hook no longer needed for video agent

interface Event {
  type: string
  properties?: Record<string, unknown>
}

interface EventInput {
  event: Event
}

interface ChatMessageInput {
  sessionID: string
}

interface ChatMessageOutput {
  parts: Array<{ type: string; text?: string; [key: string]: unknown }>
}

/**
 * Background notification hook - no longer needed for video agent
 */
export function createBackgroundNotificationHook(_manager: unknown) {
  const eventHandler = async ({ event }: EventInput) => {
    // No-op for video agent
  }

  const chatMessageHandler = async (
    _input: ChatMessageInput,
    _output: ChatMessageOutput,
  ): Promise<void> => {
    // No-op for video agent
  }

  return {
    "chat.message": chatMessageHandler,
    event: eventHandler,
  }
}
