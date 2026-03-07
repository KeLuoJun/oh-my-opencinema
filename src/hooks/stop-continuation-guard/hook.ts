// Simplified - stop-continuation-guard no longer needed for video agent

import type { PluginInput } from "@opencode-ai/plugin"

const HOOK_NAME = "stop-continuation-guard"

export interface StopContinuationGuard {
  event: (input: { event: { type: string; properties?: unknown } }) => Promise<void>
  "chat.message": (input: { sessionID?: string }) => Promise<void>
  stop: (sessionID: string) => void
  isStopped: (sessionID: string) => boolean
  clear: (sessionID: string) => void
}

export function createStopContinuationGuardHook(
  _ctx: PluginInput,
  _options?: {
    backgroundManager?: unknown
  }
): StopContinuationGuard {
  const stoppedSessions = new Set<string>()

  return {
    event: async (_input: { event: { type: string; properties?: unknown } }) => {
      // No-op for video agent
    },
    "chat.message": async (_input: { sessionID?: string }) => {
      // No-op for video agent
    },
    stop: (sessionID: string) => {
      stoppedSessions.add(sessionID)
    },
    isStopped: (sessionID: string) => {
      return stoppedSessions.has(sessionID)
    },
    clear: (sessionID: string) => {
      stoppedSessions.delete(sessionID)
    },
  }
}
