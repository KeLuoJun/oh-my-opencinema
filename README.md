# Oh My OpenCinema

<p align="right">
  <strong>English</strong> | <a href="./README.zh-cn.md">简体中文</a>
</p>

**An OpenCode Plugin for AI-Powered Video Storyboard Generation**

Transform video ideas into detailed shot-by-shot storyboards with automatic sub-agent orchestration.

---

## Quick Start

```bash
# Install OpenCode first, then add the plugin
cd ~/.config/opencode
bun add oh-my-opencinema
```

Edit `~/.config/opencode/opencode.json`:

```json
{
  "plugin": ["oh-my-opencinema"]
}
```

Then run `opencode` and start describing your video ideas to the Cinema agent.

---

## Agent Architecture

### Three-Tier Design

```
User ↔ Cinema (Main Orchestrator)
           ↓ task delegation
    Storyboarder (Shot Planning)
           ↓ task delegation
    Prompter + ScriptWriter (Content Generation)
```

### Agent Team

| Agent | Role | Description |
|-------|------|-------------|
| **cinema** | Director | Main orchestrator. Receives video ideas, generates Style Spine, orchestrates sub-agents, performs final QA |
| **storyboarder** | Storyboard Lead | Designs shot structure, narrative arc, shot-by-shot breakdown, cross-shot continuity planning |
| **prompter** | Prompt Engineer | Converts shots to AI video prompts with native audio embedding, bilingual (CN/EN) output |
| **script-writer** | scene narratives, emotional Narrative Writer | Creates beats, dialogue/narration |
| **scorer** | Quality Evaluator | Independent quality scoring for each sub-agent output. Scores 6 dimensions (≥0.7 to pass, ≤2 retries on failure) |

### Workflow

**Step 1 — Requirement Analysis**
- Cinema analyzes user's video brief
- If missing info (duration, platform, aspect ratio, style references, characters, audio needs), asks clarifying questions in one go

**Step 2 — Style Spine Generation (Required First)**
- Generate consistent visual style guidelines:
  - `aesthetic`: One-sentence visual style definition
  - `palette_anchors`: 3-5 specific color keywords
  - `lighting_logic`: Main light source, direction, shadow treatment
  - `camera_grammar`: Cinematography preferences
  - `lens_character`: Focal length, depth of field style
  - `motion_tempo`: Rhythm foundation
  - `audio_world`: Overall audio atmosphere
  - `audio_palette`: Sound themes throughout the video
  - `scene_transitions`: Transition methods
  - `forbidden_visual/audio`: Elements to avoid

**Step 3 — Storyboard Generation**
- Cinema delegates to sub-agents via `task` tool:
  1. **Storyboarder** → generates shot structure (JSON artifact)
  2. **Scorer** → scores output (≥0.7 to pass, <0.7 returns for retry, max 2 retries)
  3. **Prompter** → converts to AI video prompts
  4. **Scorer** → scores output (≥0.7 to pass, <0.7 returns for retry, max 2 retries)
  5. **ScriptWriter** → creates narrative text
  6. **Scorer** → scores output (≥0.7 to pass, <0.7 returns for retry, max 2 retries)

**Step 4 — QA & Delivery**
- Scorer evaluates each sub-agent independently
- Cinema performs final QA:
  - Four-elements per shot (frame + action + lighting + audio)
  - Style Spine palette anchors in every prompt
  - Audio palette in Audio paragraphs
  - Bilingual consistency
  - Complete emotional arc

---

## Features

- **Automatic Delegation** — Cinema automatically delegates to specialized sub-agents
- **Style Spine Generation** — Consistent visual style guidelines
- **Multi-Shot Planning** — Detailed shot breakdown with descriptions
- **Prompt Engineering** — Optimized prompts for AI video tools (Kling, Veo, Sora, Runway)
- **Script Writing** — Narrative text, captions, and dialogue
- **Bilingual Output** — Chinese and English prompts for each shot
- **Native Audio Embedding** — Audio descriptions embedded in prompts
- **Independent Quality Scoring** — Scorer agent evaluates each sub-agent output with 6 dimensions (completeness, style visual, style audio, consistency, emotional arc, coherence). Threshold ≥0.7, max 2 retries on failure

---

## Configuration

### Agent Configuration

Configure each agent with a specific LLM model:

```jsonc
{
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
    },
    "scorer": {
      "model": "anthropic/claude-sonnet-4-6",
      "threshold": 0.7,
      "max_retries": 2
    }
  }
}
```

### Category Configuration

Configure task delegation categories:

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

### Disable Agents

```jsonc
{
  "disabled_agents": ["script-writer"]
}
```

---

## Usage

1. Start a new session in OpenCode
2. Describe your video idea to Cinema agent
3. Cinema will automatically orchestrate the storyboard generation

**Example:**
```
Create a storyboard for a 30-second romantic short film about two characters meeting at a coffee shop.
```

### Output Format

Cinema agent outputs a Markdown document:
1. **Production Summary** — Project overview
2. **Style Spine** — Visual & audio style guidelines
3. **Character Bible** — Character descriptions
4. **Shot Prompts** — Bilingual prompts (CN/EN) with Audio for each shot
5. **Platform Recommendations** — Kling/Veo/Sora/Runway optimization
6. **QA Report** — Quality assurance checklist

---

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

---

## License

SUL-1.0

---

## Links

- [OpenCode Official Repository](https://github.com/anomalyco/opencode)
- [Oh My OpenCinema GitHub](https://github.com/code-yeongyu/oh-my-opencinema)
