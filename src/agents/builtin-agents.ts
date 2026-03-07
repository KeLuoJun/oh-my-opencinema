import type { AgentConfig } from "@opencode-ai/sdk"
import { createCinemaAgent } from "./cinema"
import type { AgentOverrides } from "./types"

export async function createBuiltinAgents(
  disabledAgents: string[] = [],
  agentOverrides: AgentOverrides = {},
  directory?: string,
  systemDefaultModel?: string,
): Promise<Record<string, AgentConfig>> {
  const result: Record<string, AgentConfig> = {}

  // Only create cinema agent if not disabled
  const disabledAgentNames = new Set(disabledAgents.map((name) => name.toLowerCase()))

  if (!disabledAgentNames.has("cinema")) {
    // Use default model or system model
    const model = systemDefaultModel ?? "claude-sonnet-4-20250514"
    result["cinema"] = createCinemaAgent(model)
  }

  return result
}
