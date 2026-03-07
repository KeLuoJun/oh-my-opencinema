// Stub - boulder state no longer needed for video agent

export interface BoulderState {
  active: boolean
  task?: string
}

export interface PlanProgress {
  total: number
  completed: number
}

export function clearBoulderState(_directory: string): void {
  // No-op for video agent
}

export function readBoulderState(_directory: string): BoulderState | null {
  return null
}

export function writeBoulderState(_directory: string, _state: BoulderState): void {
  // No-op for video agent
}

export function appendSessionId(_directory: string, _sessionId: string): void {
  // No-op for video agent
}

export function findPrometheusPlans(_directory: string): string[] {
  return []
}

export function getPlanProgress(_directory: string, _sessionId: string): PlanProgress | null {
  return null
}

export function createBoulderState(_directory: string, _sessionId: string, _task: string): void {
  // No-op for video agent
}

export function getPlanName(_directory: string, _sessionId: string): string | null {
  return null
}
