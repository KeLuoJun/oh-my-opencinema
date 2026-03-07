# Oh My OpenCinema

An OpenCode plugin for AI-powered video storyboard generation. Transform your video ideas into detailed shot-by-shot storyboards with automatic sub-agent orchestration.

## Prerequisites

This plugin requires [OpenCode](https://github.com/anomalyco/opencode). Please install OpenCode first before using this plugin.

## Overview

Oh My OpenCinema leverages AI to help you create professional video storyboards. Simply describe your video idea, and the plugin automatically orchestrates a team of specialized AI agents:

- **Cinema Agent** - Main orchestrator that receives video ideas and manages the entire workflow
- **Storyboarder Agent** - Designs shot structure and narrative arc
- **Prompter Agent** - Generates AI video prompts with audio embedding suggestions
- **Script Writer Agent** - Creates narrative text and dialogue

## Features

- **Automatic Delegation** - The Cinema agent automatically delegates tasks to specialized sub-agents
- **Style Spine Generation** - Generates consistent visual style guidelines for your video
- **Multi-Shot Planning** - Breaks down your video into detailed shots with descriptions
- **Prompt Engineering** - Creates optimized prompts for AI video generation tools
- **Script Writing** - Generates narrative text, captions, and dialogue

## Installation

Install the plugin globally or locally in your project:

```bash
npm install oh-my-opencinema
```

Or using bun:

```bash
bun add oh-my-opencinema
```

## Configuration

After installation, configure the plugin in your project's `opencode.jsonc` file:

### Agent Configuration

You can configure each agent with a specific LLM model. If not configured, agents will inherit the model from the parent agent (OpenCode's main agent):

```jsonc
{
  // Configure models for each agent (optional - defaults to parent's model)
  "agents": {
    "cinema": {
      "model": "anthropic/claude-sonnet-4-6",
      "variant": "latest"
    },
    "storyboarder": {
      "model": "openai/gpt-4o"
    },
    "prompter": {
      "model": "anthropic/claude-opus-4-6"
    },
    "script-writer": {
      "model": "openai/gpt-4o"
    }
  }
}
```

### Category Configuration

You can also configure categories for task delegation:

```jsonc
{
  "categories": {
    "storyboard": {
      "model": "anthropic/claude-sonnet-4-6"
    },
    "prompt-engineering": {
      "model": "openai/gpt-4o"
    },
    "narrative": {
      "model": "anthropic/claude-opus-4-6"
    }
  }
}
```

**Model Configuration Precedence:**
1. Explicit agent/category model configuration
2. Agent override model
3. Category resolved model
4. Inherited from parent agent (default when not configured)

## Usage

1. Start a new session in OpenCode
2. Use the `cinema` agent by describing your video idea
3. The Cinema agent will automatically orchestrate the storyboard generation

Example:
```
Create a storyboard for a 30-second romantic short film about two characters meeting at a coffee shop.
```

## Development

```bash
# Install dependencies
bun install

# Build the plugin
bun run build

# Run tests
bun test

# Type checking
bun run typecheck
```

## License

SUL-1.0

## Links

- [OpenCode Official Repository](https://github.com/anomalyco/opencode)
- [Oh My OpenCinema GitHub](https://github.com/code-yeongyu/oh-my-opencinema)
