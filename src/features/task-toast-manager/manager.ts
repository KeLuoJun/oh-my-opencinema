// Simplified - task-toast-manager no longer needs concurrency for video agent

import type { PluginInput } from "@opencode-ai/plugin"
import type { TrackedTask, TaskStatus, ModelFallbackInfo } from "./types"

type OpencodeClient = PluginInput["client"]

type ClientWithTui = {
  tui?: {
    showToast: (opts: { body: { title: string; message: string; variant: string; duration: number } }) => Promise<unknown>
  }
}

export class TaskToastManager {
  private tasks: Map<string, TrackedTask> = new Map()
  private client: OpencodeClient

  constructor(client: OpencodeClient, _concurrencyManager?: unknown) {
    this.client = client
  }

  setConcurrencyManager(_manager: unknown): void {
    // No-op for video agent
  }

  addTask(task: {
    id: string
    sessionID?: string
    description: string
    status: TaskStatus
    agent?: string
    isBackground?: boolean
  }): void {
    this.tasks.set(task.id, {
      id: task.id,
      sessionID: task.sessionID,
      description: task.description,
      status: task.status,
      agent: task.agent || "",
      startedAt: new Date(),
      isBackground: false,
    })
  }

  updateTaskStatus(taskId: string, status: TaskStatus): void {
    const task = this.tasks.get(taskId)
    if (task) {
      task.status = status
    }
  }

  removeTask(taskId: string): void {
    this.tasks.delete(taskId)
  }

  getTasks(): TrackedTask[] {
    return Array.from(this.tasks.values())
  }

  getTask(taskId: string): TrackedTask | undefined {
    return this.tasks.get(taskId)
  }

  getModelFallbackInfo(): ModelFallbackInfo | undefined {
    // Simplified for video agent
    return undefined
  }

  updateTaskModelBySession(_sessionID: string, _model: string): void {
    // Simplified for video agent
  }

  formatActiveTasks(): string {
    const active = this.getTasks().filter(t => t.status === "running")
    if (active.length === 0) return ""

    const lines = active.map(t => `- ${t.description}`)
    return `Active tasks (${active.length}):\n${lines.join("\n")}`
  }

  showTaskToast(taskId: string, message: string): void {
    const task = this.getTask(taskId)
    if (!task) return

    const client = this.client as ClientWithTui
    if (client.tui) {
      client.tui.showToast({
        body: {
          title: task.description,
          message,
          variant: "info",
          duration: 3000,
        },
      }).catch(() => {})
    }
  }

  clear(): void {
    this.tasks.clear()
  }
}

let instance: TaskToastManager | null = null

export function initTaskToastManager(client: OpencodeClient): TaskToastManager {
  if (!instance) {
    instance = new TaskToastManager(client)
  }
  return instance
}

export function getTaskToastManager(): TaskToastManager | null {
  return instance
}
