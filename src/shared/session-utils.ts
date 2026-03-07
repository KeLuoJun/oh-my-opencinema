import type { PluginInput } from "@opencode-ai/plugin"

export async function isCallerOrchestrator(_sessionID?: string, _client?: PluginInput["client"]): Promise<boolean> {
  // Legacy function - no longer needed for video agent
  return false
}
