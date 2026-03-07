/**
 * Simplified type definitions for video production agents
 * These replace the old dynamic-agent-prompt-builder for the Cinema plugin
 */

export interface AvailableAgent {
  name: string;
  description: string;
  metadata?: {
    category?: string;
    cost?: string;
    triggers?: Array<{ domain: string; trigger: string }>;
  };
}

export interface AvailableTool {
  name: string;
  description?: string;
}

export interface AvailableSkill {
  name: string;
  description: string;
  location?: string;
}

export interface AvailableCategory {
  name: string;
  description: string;
  model?: string;
}
