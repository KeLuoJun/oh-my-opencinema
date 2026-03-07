# Oh My OpenCinema

An OpenCode plugin for AI-powered video storyboard generation. Transform your video ideas into detailed shot-by-shot storyboards with automatic sub-agent orchestration.

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

```bash
npm install oh-my-opencode
```

Or use bun:

```bash
bun add oh-my-opencode
```

## Usage

1. Install the plugin in OpenCode
2. Start a new session and use the `cinema` agent
3. Describe your video idea (e.g., "A romantic sunset scene on a beach")
4. The Cinema agent will automatically orchestrate the storyboard generation

Example prompt:
```
Create a storyboard for a 30-second romantic short film about two characters meeting at a coffee shop.
```

## Configuration

Create an `opencode.jsonc` file in your project:

```jsonc
{
  // Enable the cinema agent
  "agents": {
    "cinema": {
      "enabled": true
    }
  },
  // Optional: Configure categories for task delegation
  "categories": {
    "storyboard": {
      "enabled": true
    },
    "prompt-engineering": {
      "enabled": true
    },
    "narrative": {
      "enabled": true
    }
  }
}
```

## Architecture

```
src/
├── agents/              # AI agents (cinema, storyboarder, prompter, script-writer)
├── hooks/              # OpenCode lifecycle hooks
├── tools/              # Tools including delegate-task for sub-agent orchestration
├── features/           # Standalone feature modules
├── config/             # Zod schema system
├── mcp/                # Built-in MCPs (websearch, context7, grep_app)
└── plugin/             # OpenCode hook handlers
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

## Author

YeonGyu-Kim
