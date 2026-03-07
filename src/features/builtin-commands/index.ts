// Stub - builtin commands no longer needed for video agent

export interface BuiltinCommand {
  name: string
  description: string
}

export async function loadBuiltinCommands(): Promise<BuiltinCommand[]> {
  return []
}
