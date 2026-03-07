// Stub - background agent no longer needed for video agent

import type { PluginContext } from "../../plugin/types"

export interface SubagentSessionCreatedEvent {
  sessionID: string
  parentID: string
  title: string
}

export interface BackgroundTask {
  id: string
  sessionID: string
  description: string
  agent: string
  status: string
  isBackground?: boolean
  model?: { providerID: string; modelID: string; variant?: string }
}

export interface BackgroundManager {
  onSubagentSessionCreated: (event: SubagentSessionCreatedEvent) => void
  onShutdown: () => void
  launch: (options: {
    description: string
    prompt: string
    agent: string
    parentSessionID: string
    parentMessageID: string
    parentModel?: { providerID: string; modelID: string; variant?: string }
    parentAgent?: string
    parentTools?: Record<string, unknown>
    skills?: string[]
    skillContent?: string
    category?: string
    model?: { providerID: string; modelID: string; variant?: string }
    fallbackChain?: unknown[]
  }) => Promise<{ id: string; sessionID: string; description: string; agent: string; status: string; isBackground?: boolean; model?: { providerID: string; modelID: string; variant?: string } }>
  getTask: (taskId: string) => Promise<{ id: string; sessionID: string; description: string; agent: string; status: string; isBackground?: boolean; model?: { providerID: string; modelID: string; variant?: string } } | null>
  resume: (sessionId: string, options?: { prompt?: string }) => Promise<{ id: string; sessionID: string; description: string; agent: string; status: string; isBackground?: boolean; model?: { providerID: string; modelID: string; variant?: string } }>
  cancelTask: (taskId: string) => Promise<void>
  getAllDescendantTasks: (sessionId: string) => Promise<BackgroundTask[]>
  taskHistory: () => Promise<BackgroundTask[]>
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class BackgroundManager {
  constructor(
    _ctx: PluginContext,
    _config: unknown,
    _options: {
      tmuxConfig?: unknown
      onSubagentSessionCreated: (event: SubagentSessionCreatedEvent) => void
      onShutdown: () => void
      enableParentSessionNotifications?: boolean
    }
  ) {
    // No-op for video agent
  }
}
