import type { OhMyOpenCodeConfig } from "./config"
import type { ModelCacheState } from "./plugin-state"
import type { PluginContext } from "./plugin/types"

import { SkillMcpManager } from "./features/skill-mcp-manager"
import { initTaskToastManager } from "./features/task-toast-manager"
import { createConfigHandler } from "./plugin-handlers"

export type Managers = {
  skillMcpManager: SkillMcpManager
  configHandler: ReturnType<typeof createConfigHandler>
  backgroundManager?: unknown
  tmuxSessionManager?: unknown
}

export function createManagers(args: {
  ctx: PluginContext
  pluginConfig: OhMyOpenCodeConfig
  modelCacheState: ModelCacheState
}): Managers {
  const { ctx, pluginConfig, modelCacheState } = args

  initTaskToastManager(ctx.client)

  const skillMcpManager = new SkillMcpManager()

  const configHandler = createConfigHandler({
    ctx: { directory: ctx.directory, client: ctx.client },
    pluginConfig,
    modelCacheState,
  })

  return {
    skillMcpManager,
    configHandler,
  }
}
