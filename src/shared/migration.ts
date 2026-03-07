// Video agent migration - simplified

export const BUILTIN_AGENT_NAMES = ["cinema"] as const

export const AGENT_NAME_MAP: Record<string, string> = {
  cinema: "cinema",
}

export function migrateAgentNames(agents: string[]): string[] {
  return agents.map((agent) => AGENT_NAME_MAP[agent.toLowerCase()] ?? agent)
}

export const HOOK_NAME_MAP: Record<string, string> = {}

export function migrateHookNames(hooks: string[]): string[] {
  return hooks.map((hook) => HOOK_NAME_MAP[hook.toLowerCase()] ?? hook)
}

export type ModelVersionMap = Record<string, string>
export const MODEL_VERSION_MAP: ModelVersionMap = {}

export function migrateModelVersions(config: Record<string, unknown>): Record<string, unknown> {
  return config
}

export type CategoryMap = Record<string, string>
export const MODEL_TO_CATEGORY_MAP: CategoryMap = {
  storyboard: "storyboard",
  "prompt-engineering": "prompt-engineering",
  narrative: "narrative",
  quick: "quick",
}

export function migrateAgentConfigToCategory(agentConfig: Record<string, unknown>): Record<string, unknown> {
  return agentConfig
}

export function shouldDeleteAgentConfig(key: string): boolean {
  return !BUILTIN_AGENT_NAMES.includes(key as typeof BUILTIN_AGENT_NAMES[number])
}

export async function migrateConfigFile(_config: Record<string, unknown>): Promise<Record<string, unknown>> {
  return _config
}
