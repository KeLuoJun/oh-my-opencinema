// Stub - start-work no longer needed for video agent

import type { PluginInput } from "@opencode-ai/plugin"

export const HOOK_NAME = "start-work" as const

interface StartWorkHookInput {
  sessionID: string
  messageID?: string
}

interface StartWorkHookOutput {
  parts: Array<{ type: string; text?: string }>
}

export function createStartWorkHook(_ctx: PluginInput) {
  return {
    [HOOK_NAME]: {
      event: async (_input: StartWorkHookInput) => {
        // No-op for video agent
      },
      "chat.message": async (_input: StartWorkHookInput, _output: StartWorkHookOutput) => {
        // No-op for video agent
      },
    },
  }
}
