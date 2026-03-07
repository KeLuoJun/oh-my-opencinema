# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Oh My OpenCinema** - An OpenCode plugin for AI video production. Users install via `npm install oh-my-openCinema` and can directly use the "cinema" agent in OpenCode to generate AI video storyboards with automatic sub-agent delegation.

## Commands

```bash
bun run build                # Build plugin (ESM + declarations + schema)
bun test                     # Run all tests
bun run typecheck            # tsc --noEmit (strict)
bun run build:all            # Build + platform binaries
bun run build:schema         # Generate JSON schema
bunx oh-my-opencode install  # Interactive setup
bunx oh-my-opencode doctor   # Health diagnostics
```

- **Runtime**: Bun only — never use npm/yarn/npx
- **Debug log**: `/tmp/oh-my-opencode.log`

## Architecture

```
src/
├── index.ts              # Entry: loadConfig → createManagers → createTools → createHooks → createPluginInterface
├── plugin-config.ts      # JSONC multi-level config loading (Zod v4)
├── agents/               # Video production agents (cinema, storyboarder, prompter, script-writer)
├── hooks/                # Lifecycle hooks (~40 hooks across multiple tiers)
├── tools/                # Tools including delegate-task for sub-agent orchestration
├── features/             # Standalone feature modules
├── shared/               # Utility files
├── config/               # Zod v4 schema system
├── cli/                  # CLI: install, run, doctor (Commander.js)
├── mcp/                  # Built-in MCPs
├── plugin/               # OpenCode hook handlers
└── plugin-handlers/      # Config loading pipeline
```

## Video Production Agents

The plugin now focuses on a single "Cinema" agent that automatically orchestrates sub-agents:

| Agent | Purpose |
|-------|---------|
| `cinema` | Main agent - receives video ideas, orchestrates workflow |
| `storyboarder` | Shot structure planning, narrative arc design |
| `prompter` | AI video prompt generation with audio embedding |
| `script-writer` | Narrative text writing |

## Key Files

- `src/agents/cinema.ts` - Main Cinema agent with Style Spine generation
- `src/agents/builtin-agents.ts` - Factory for creating cinema agent
- `src/tools/delegate-task/constants.ts` - Category definitions (storyboard, prompt-engineering, narrative, quick)

## Conventions

- **TypeScript**: strict mode, ESNext, `moduleResolution: bundler`, `bun-types`
- **Tests**: `bun:test`, co-located `*.test.ts`, given/when/then style
- **Factories**: `createXXX()` for all tools, hooks, agents
- **File naming**: kebab-case
- **No path aliases**: relative imports only
- **Config format**: JSONC with comments, Zod v4 validation, snake_case keys

## Anti-patterns

- Never use `as any`, `@ts-ignore`, or suppress errors
- Never create catch-all files (`utils.ts`, `helpers.ts`)
- Empty `catch(e) {}` blocks — always handle errors explicitly
- Never run `bun publish` — use GitHub Actions
- Never modify `package.json` version locally
- Tests: given/when/then only — never use Arrange-Act-Assert comments
