import {
  lsp_goto_definition,
  lsp_find_references,
  lsp_symbols,
  lsp_diagnostics,
  lsp_prepare_rename,
  lsp_rename,
  lspManager,
} from "./lsp"

export { lspManager }

export { createAstGrepTools } from "./ast-grep"
export { createGrepTools } from "./grep"
export { createGlobTools } from "./glob"
export { createSkillTool } from "./skill"
export { discoverCommandsSync } from "./slashcommand"
export { createSessionManagerTools } from "./session-manager"

export { sessionExists } from "./session-manager/storage"

export { interactive_bash, startBackgroundCheck as startTmuxCheck } from "./interactive-bash"
export { createSkillMcpTool } from "./skill-mcp"

import type { PluginInput, ToolDefinition } from "@opencode-ai/plugin"

type OpencodeClient = PluginInput["client"]

export { createLookAt } from "./look-at"
export { createDelegateTask } from "./delegate-task"
export {
  createTaskCreateTool,
  createTaskGetTool,
  createTaskList,
  createTaskUpdateTool,
} from "./task"
export { createHashlineEditTool } from "./hashline-edit"

// Stubs - no longer needed for video agent
export function createBackgroundTools(_manager: unknown, _client: OpencodeClient): Record<string, ToolDefinition> {
  return {}
}

export function createCallOmoAgent(_ctx: unknown, _manager: unknown, _disabledAgents: string[]): Record<string, ToolDefinition> {
  return {}
}

export const builtinTools: Record<string, ToolDefinition> = {
  lsp_goto_definition,
  lsp_find_references,
  lsp_symbols,
  lsp_diagnostics,
  lsp_prepare_rename,
  lsp_rename,
}
