// Stub - tmux subagent no longer needed for video agent

import type { PluginContext } from "../../plugin/types"

export interface TmuxConfig {
  enabled?: boolean
}

export interface SessionCreatedEvent {
  type: string
  properties: {
    info: {
      id: string
      parentID: string
      title: string
    }
  }
}

export class TmuxSessionManager {
  constructor(_ctx: PluginContext, _config: TmuxConfig) {
    // No-op for video agent
  }

  async onSessionCreated(_event: SessionCreatedEvent): Promise<void> {
    // No-op for video agent
  }

  async cleanup(): Promise<void> {
    // No-op for video agent
  }
}
