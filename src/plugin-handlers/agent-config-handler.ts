import { createBuiltinAgents } from "../agents";
import type { OhMyOpenCodeConfig } from "../config";
import { log, migrateAgentConfig } from "../shared";
import { AGENT_NAME_MAP } from "../shared/migration";
import { getAgentDisplayName } from "../shared/agent-display-names";
import {
  discoverConfigSourceSkills,
  discoverOpencodeGlobalSkills,
  discoverOpencodeProjectSkills,
  discoverProjectClaudeSkills,
  discoverUserClaudeSkills,
} from "../features/opencode-skill-loader";
import { loadProjectAgents, loadUserAgents } from "../features/claude-code-agent-loader";
import type { PluginComponents } from "./plugin-components-loader";
import { reorderAgentsByPriority } from "./agent-priority-order";
import { remapAgentKeysToDisplayNames } from "./agent-key-remapper";

type AgentConfigRecord = Record<string, Record<string, unknown> | undefined>;

export async function applyAgentConfig(params: {
  config: Record<string, unknown>;
  pluginConfig: OhMyOpenCodeConfig;
  ctx: { directory: string; client?: any };
  pluginComponents: PluginComponents;
}): Promise<Record<string, unknown>> {
  const migratedDisabledAgents = (params.pluginConfig.disabled_agents ?? []).map(
    (agent) => {
      return AGENT_NAME_MAP[agent.toLowerCase()] ?? AGENT_NAME_MAP[agent] ?? agent;
    },
  ) as typeof params.pluginConfig.disabled_agents;

  const includeClaudeSkillsForAwareness = params.pluginConfig.claude_code?.skills ?? true;
  const [
    discoveredConfigSourceSkills,
    discoveredUserSkills,
    discoveredProjectSkills,
    discoveredOpencodeGlobalSkills,
    discoveredOpencodeProjectSkills,
  ] = await Promise.all([
    discoverConfigSourceSkills({
      config: params.pluginConfig.skills,
      configDir: params.ctx.directory,
    }),
    includeClaudeSkillsForAwareness ? discoverUserClaudeSkills() : Promise.resolve([]),
    includeClaudeSkillsForAwareness
       ? discoverProjectClaudeSkills(params.ctx.directory)
       : Promise.resolve([]),
    discoverOpencodeGlobalSkills(),
    discoverOpencodeProjectSkills(params.ctx.directory),
  ]);

  const allDiscoveredSkills = [
    ...discoveredConfigSourceSkills,
    ...discoveredOpencodeProjectSkills,
    ...discoveredProjectSkills,
    ...discoveredOpencodeGlobalSkills,
    ...discoveredUserSkills,
  ];

  const currentModel = params.config.model as string | undefined;

  // Simplified: only create cinema agent
  const builtinAgents = await createBuiltinAgents(
    migratedDisabledAgents,
    params.pluginConfig.agents,
    params.ctx.directory,
    currentModel,
  );

  const includeClaudeAgents = params.pluginConfig.claude_code?.agents ?? true;
  const userAgents = includeClaudeAgents ? loadUserAgents() : {};
  const projectAgents = includeClaudeAgents ? loadProjectAgents(params.ctx.directory) : {};

  const rawPluginAgents = params.pluginComponents.agents;
  const pluginAgents = Object.fromEntries(
    Object.entries(rawPluginAgents).map(([key, value]) => [
      key,
      value ? migrateAgentConfig(value as Record<string, unknown>) : value,
    ]),
  );

  const disabledAgentNames = new Set(
    (migratedDisabledAgents ?? []).map(a => a.toLowerCase())
  );

  const filterDisabledAgents = (agents: Record<string, unknown>) =>
    Object.fromEntries(
      Object.entries(agents).filter(([name]) => !disabledAgentNames.has(name.toLowerCase()))
    );

  // Set default agent to cinema if enabled
  const isCinemaEnabled = !disabledAgentNames.has("cinema");

  if (isCinemaEnabled && builtinAgents.cinema) {
    (params.config as { default_agent?: string }).default_agent =
      getAgentDisplayName("cinema");
  }

  const configAgent = params.config.agent as AgentConfigRecord | undefined;

  // Build final agent config
  params.config.agent = {
    ...builtinAgents,
    ...filterDisabledAgents(userAgents),
    ...filterDisabledAgents(projectAgents),
    ...filterDisabledAgents(pluginAgents),
    ...configAgent,
  };

  if (params.config.agent) {
    params.config.agent = remapAgentKeysToDisplayNames(
      params.config.agent as Record<string, unknown>,
    );
    params.config.agent = reorderAgentsByPriority(
      params.config.agent as Record<string, unknown>,
    );
  }

  const agentResult = params.config.agent as Record<string, unknown>;
  log("[config-handler] agents loaded", { agentKeys: Object.keys(agentResult) });
  return agentResult;
}
