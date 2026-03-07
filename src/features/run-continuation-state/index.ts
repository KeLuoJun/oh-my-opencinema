// Stub - run continuation state no longer needed for video agent

export interface RunContinuationState {
  sessionId: string
  category?: string
}

export function clearRunContinuationState(_directory: string, _sessionId: string): void {
  // No-op for video agent
}

export function getRunContinuationState(_directory: string, _sessionId: string): RunContinuationState | null {
  return null
}

export function setRunContinuationState(_directory: string, _sessionId: string, _state: RunContinuationState): void {
  // No-op for video agent
}

export function clearContinuationMarker(_directory: string, _sessionId: string): void {
  // No-op for video agent
}

export function setContinuationMarkerSource(_directory: string, _sessionId: string, _source: string): void {
  // No-op for video agent
}
