import type { AvailableSkill } from "./agents/dynamic-agent-prompt-builder"
import type { HookName, OhMyOpenCodeConfig } from "./config"
import type { LoadedSkill } from "./features/opencode-skill-loader/types"
import type { PluginContext } from "./plugin/types"
import type { ModelCacheState } from "./plugin-state"

import { createCoreHooks } from "./plugin/hooks/create-core-hooks"
import { createSkillHooks } from "./plugin/hooks/create-skill-hooks"

export type CreatedHooks = ReturnType<typeof createHooks>

export function createHooks(args: {
  ctx: PluginContext
  pluginConfig: OhMyOpenCodeConfig
  modelCacheState: ModelCacheState
  isHookEnabled: (hookName: HookName) => boolean
  safeHookEnabled: boolean
  mergedSkills: LoadedSkill[]
  availableSkills: AvailableSkill[]
}) {
  const {
    ctx,
    pluginConfig,
    modelCacheState,
    isHookEnabled,
    safeHookEnabled,
    mergedSkills,
    availableSkills,
  } = args

  const core = createCoreHooks({
    ctx,
    pluginConfig,
    modelCacheState,
    isHookEnabled,
    safeHookEnabled,
  })

  const skill = createSkillHooks({
    ctx,
    pluginConfig,
    isHookEnabled,
    safeHookEnabled,
    mergedSkills,
    availableSkills,
  })

  return {
    ...core,
    ...skill,
    // Add stubs for removed hooks
    compactionTodoPreserver: null,
    compactionContextInjector: null,
    backgroundNotificationHook: null,
  }
}
