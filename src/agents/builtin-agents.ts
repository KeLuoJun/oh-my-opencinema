import type { AgentConfig } from "@opencode-ai/sdk"
import { createCinemaAgent } from "./cinema"
import { createScorerAgent } from "./scorer"
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

  // Create scorer agent if not disabled
  if (!disabledAgentNames.has("scorer")) {
    const model = systemDefaultModel ?? "claude-sonnet-4-20250514"
    result["scorer"] = createScorerAgent(model)
  }

  return result
}
