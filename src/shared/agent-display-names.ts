// Simplified agent display names for video agent

export const AGENT_DISPLAY_NAMES: Record<string, string> = {
  cinema: "cinema",
}

export function getAgentDisplayName(agentName: string): string {
  return AGENT_DISPLAY_NAMES[agentName.toLowerCase()] ?? agentName
}

export function getAgentConfigKey(agentName: string): string {
  return agentName.toLowerCase()
}
