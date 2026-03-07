# Oh My OpenCinema 改造实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将 oh-my-opencode 项目改造为影视视频分镜多 Agent 系统（Oh My OpenCinema），删除原有编程 Agent，添加影视领域 Agent

**Architecture:** 保留底层能力（Hook、LSP、Background Agent），仅替换 Agent 集合和任务分类系统

**Tech Stack:** TypeScript, OpenCode SDK, Claude/Gemini Models

---

## 阶段 1: 删除原有 Agent 文件

### Task 1: 删除核心 Agent 定义文件

**Files:**
- Delete: `src/agents/sisyphus.ts`
- Delete: `src/agents/hephaestus.ts`
- Delete: `src/agents/oracle.ts`
- Delete: `src/agents/librarian.ts`
- Delete: `src/agents/explore.ts`

**Step 1: 删除 sisyphus 目录**
```bash
rm -rf src/agents/sisyphus
```

**Step 2: 删除 hephaestus 目录**
```bash
rm -rf src/agents/hephaestus
```

**Step 3: 删除 explore.ts**
```bash
rm src/agents/explore.ts
```

**Step 4: 删除 oracle.ts**
```bash
rm src/agents/oracle.ts
```

**Step 5: 删除 librarian.ts**
```bash
rm src/agents/librarian.ts
```

---

### Task 2: 删除 sisyphus-junior 目录

**Files:**
- Delete: `src/agents/sisyphus-junior/`

**Step 1: 删除目录**
```bash
rm -rf src/agents/sisyphus-junior
```

---

### Task 3: 删除 builtin-agents 中的配置

**Files:**
- Delete: `src/agents/builtin-agents/sisyphus-agent.ts`
- Delete: `src/agents/builtin-agents/hephaestus-agent.ts`

**Step 1: 删除文件**
```bash
rm src/agents/builtin-agents/sisyphus-agent.ts
rm src/agents/builtin-agents/hephaestus-agent.ts
```

---

### Task 4: 删除 config/schema 中的配置

**Files:**
- Delete: `src/config/schema/sisyphus.ts`
- Delete: `src/config/schema/sisyphus-agent.ts`

**Step 1: 删除文件**
```bash
rm src/config/schema/sisyphus.ts
rm src/config/schema/sisyphus-agent.ts
```

---

### Task 5: 修改 builtin-agents.ts 移除旧 Agent 引用

**Files:**
- Modify: `src/agents/builtin-agents.ts`

**Step 1: 更新导入**
删除以下导入：
```typescript
import { createSisyphusAgent } from "./sisyphus"
import { createOracleAgent, ORACLE_PROMPT_METADATA } from "./oracle"
import { createLibrarianAgent, LIBRARIAN_PROMPT_METADATA } from "./librarian"
import { createExploreAgent, EXPLORE_PROMPT_METADATA } from "./explore"
import { createHephaestusAgent } from "./hephaestus"
import { maybeCreateSisyphusConfig } from "./builtin-agents/sisyphus-agent"
import { maybeCreateHephaestusConfig } from "./builtin-agents/hephaestus-agent"
```

**Step 2: 更新 agentSources**
```typescript
// 修改前
const agentSources: Record<BuiltinAgentName, AgentSource> = {
  sisyphus: createSisyphusAgent,
  hephaestus: createHephaestusAgent,
  oracle: createOracleAgent,
  librarian: createLibrarianAgent,
  explore: createExploreAgent,
  ...
}

// 修改后 - 移除 sisyphus, hephaestus, oracle, librarian, explore
const agentSources: Record<BuiltinAgentName, AgentSource> = {
  "multimodal-looker": createMultimodalLookerAgent,
  metis: createMetisAgent,
  momus: createMomusAgent,
  atlas: createAtlasAgent as AgentFactory,
}
```

**Step 3: 更新 agentMetadata**
```typescript
// 删除 oracle, librarian, explore 的 metadata
const agentMetadata: Partial<Record<BuiltinAgentName, AgentPromptMetadata>> = {
  "multimodal-looker": MULTIMODAL_LOOKER_PROMPT_METADATA,
  metis: metisPromptMetadata,
  momus: momusPromptMetadata,
  atlas: atlasPromptMetadata,
}
```

**Step 4: 删除 sisyphusConfig 和 hephaestusConfig 生成代码**
删除：
```typescript
const sisyphusConfig = maybeCreateSisyphusConfig({...})
if (sisyphusConfig) {
  result["sisyphus"] = sisyphusConfig
}

const hephaestusConfig = maybeCreateHephaestusConfig({...})
if (hephaestusConfig) {
  result["hephaestus"] = hephaestusConfig
}
```

---

### Task 6: 修改 types.ts 移除旧 Agent 类型

**Files:**
- Modify: `src/agents/types.ts`

**Step 1: 更新 BuiltinAgentName 类型**
```typescript
// 修改前
export type BuiltinAgentName =
  | "sisyphus"
  | "hephaestus"
  | "oracle"
  | "librarian"
  | "explore"
  | "multimodal-looker"
  | "metis"
  | "momus"
  | "atlas";

// 修改后 - 移除 sisyphus, hephaestus, oracle, librarian, explore
export type BuiltinAgentName =
  | "director"
  | "storyboarder"
  | "prompter"
  | "script-writer"
  | "multimodal-looker"
  | "metis"
  | "momus"
  | "atlas";
```

---

### Task 7: 修改 delegate-task/constants.ts 重新定义 Categories

**Files:**
- Modify: `src/tools/delegate-task/constants.ts`

**Step 1: 删除旧的 CATEGORY_PROMPT_APPENDS**
删除：VISUAL_CATEGORY_PROMPT_APPEND, ULTRABRAIN_CATEGORY_PROMPT_APPEND, ARTISTRY_CATEGORY_PROMPT_APPEND, QUICK_CATEGORY_PROMPT_APPEND, UNSPECIFIED_LOW_CATEGORY_PROMPT_APPEND, UNSPECIFIED_HIGH_CATEGORY_PROMPT_APPEND, WRITING_CATEGORY_PROMPT_APPEND, DEEP_CATEGORY_PROMPT_APPEND

**Step 2: 添加新的 Category Prompt Appends**
```typescript
// Storyboard Category
export const STORYBOARD_CATEGORY_PROMPT_APPEND = `<Category_Context>
You are working on STORYBOARD DESIGN tasks.

Storyboard mindset:
- Plan complete visual narrative flow
- Design shot composition and transitions
- Maintain visual consistency across shots
- Design emotional beats and pacing

Approach:
- Establish scene context and mood
- Design each shot with specific framing
- Plan transitions between shots
- Consider audio-visual harmony
</Category_Context>`

// Prompt Engineering Category
export const PROMPT_ENGINEERING_CATEGORY_PROMPT_APPEND = `<Category_Context>
You are working on AI VIDEO PROMPT ENGINEERING tasks.

Prompt engineering mindset:
- Write precise, actionable prompts for AI video generation
- Include camera movement, lighting, subject action
- Embed audio descriptions natively in prompts
- Optimize for target platform (Kling/Veo/Sora/Runway)

Approach:
- Follow platform-specific syntax
- Include Style Spine elements
- Use verbs over adjectives
- Embed audio elements in every prompt
</Category_Context>`

// Narrative Category
export const NARRATIVE_CATEGORY_PROMPT_APPEND = `<Category_Context>
You are working on NARRATIVE/SCRIPT WRITING tasks.

Narrative mindset:
- Create compelling story beats
- Write authentic dialogue and narration
- Design emotional arcs
- Match pacing to visual rhythm

Approach:
- Develop character voices
- Write scene descriptions
- Create dialogue that serves the story
- Match tone to visual style
</Category_Context>`

// Quick Category
export const QUICK_CATEGORY_PROMPT_APPEND = `<Category_Context>
You are working on QUICK/FORMATTING tasks.

Efficient execution mindset:
- Fast, focused, minimal overhead
- Format and structure existing content
- Simple modifications to existing outputs

Approach:
- Minimal changes needed
- Direct and concise
</Category_Context>`
```

**Step 3: 更新 DEFAULT_CATEGORIES**
```typescript
// 修改前
export const DEFAULT_CATEGORIES: Record<string, CategoryConfig> = {
  "visual-engineering": { model: "google/gemini-3.1-pro", variant: "high" },
  ultrabrain: { model: "openai/gpt-5.3-codex", variant: "xhigh" },
  deep: { model: "openai/gpt-5.3-codex", variant: "medium" },
  artistry: { model: "google/gemini-3.1-pro", variant: "high" },
  quick: { model: "anthropic/claude-haiku-4-5" },
  "unspecified-low": { model: "anthropic/claude-sonnet-4-6" },
  "unspecified-high": { model: "openai/gpt-5.4", variant: "high" },
  writing: { model: "kimi-for-coding/k2p5" },
}

// 修改后 - 影视领域分类
export const DEFAULT_CATEGORIES: Record<string, CategoryConfig> = {
  "storyboard": {
    model: "anthropic/claude-sonnet-4-6",
    description: "镜头结构规划、叙事弧线设计、连贯性桥接"
  },
  "prompt-engineering": {
    model: "google/gemini-2.5-pro",
    description: "将分镜描述转化为 AI 视频生成提示词（含音频）"
  },
  "narrative": {
    model: "google/gemini-2.5-pro",
    description: "场景叙事文本、情绪节拍、对话旁白"
  },
  "quick": {
    model: "google/gemini-2.5-flash",
    description: "简单格式化、单字段修改等轻量任务"
  },
}
```

**Step 4: 更新 CATEGORY_DESCRIPTIONS**
```typescript
export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "storyboard": "镜头结构规划、叙事弧线设计、连贯性桥接",
  "prompt-engineering": "AI 视频提示词生成，含原生音频嵌入",
  "narrative": "场景叙事、对话、旁白写作",
  "quick": "轻量格式化任务",
}
```

---

## 阶段 2: 创建新的 Agent 文件

### Task 8: 创建 Director Agent

**Files:**
- Create: `src/agents/director.ts`

**Step 1: 创建 Director Agent 定义**
```typescript
import type { AgentConfig } from "@opencode-ai/sdk"
import type { AgentMode, AgentPromptMetadata } from "./types"

const MODE: AgentMode = "primary"
export const DIRECTOR_PROMPT_METADATA: AgentPromptMetadata = {
  category: "utility",
  cost: "EXPENSIVE",
  promptAlias: "Director",
  triggers: [],
}

export function createDirectorAgent(model: string): AgentConfig {
  return {
    name: "director",
    description: "Oh My OpenCinema 的总导演。用户唯一交互的 Agent。建立视觉风格脊柱，调度分镜团队，验收最终输出的分镜提示词文档。",
    mode: MODE,
    model,
    color: "#E8A838",
    temperature: 0.4,
  }
}
```

---

### Task 9: 创建 Storyboarder Agent

**Files:**
- Create: `src/agents/storyboarder.ts`

**Step 1: 创建 Storyboarder Agent 定义**
```typescript
import type { AgentConfig } from "@opencode-ai/sdk"
import type { AgentMode, AgentPromptMetadata } from "./types"

const MODE: AgentMode = "subagent"
export const STORYBOARDER_PROMPT_METADATA: AgentPromptMetadata = {
  category: "specialist",
  cost: "CHEAP",
  triggers: [],
}

export function createStoryboarderAgent(model: string): AgentConfig {
  return {
    name: "storyboarder",
    description: "分镜统筹。接收 Style Spine 和 Brief，规划完整镜头结构，设计跨镜头连贯性桥接，调度 ScriptWriter 和 Prompter，汇总 Artifact 返回 Director。",
    mode: MODE,
    model,
    temperature: 0.3,
  }
}
```

---

### Task 10: 创建 Prompter Agent

**Files:**
- Create: `src/agents/prompter.ts`

**Step 1: 创建 Prompter Agent 定义**
```typescript
import type { AgentConfig } from "@opencode-ai/sdk"
import type { AgentMode, AgentPromptMetadata } from "./types"

const MODE: AgentMode = "subagent"
export const PROMPTER_PROMPT_METADATA: AgentPromptMetadata = {
  category: "specialist",
  cost: "CHEAP",
  triggers: [],
}

export function createPrompterAgent(model: string): AgentConfig {
  return {
    name: "prompter",
    description: "AI 视频提示词工程师。接收 shot_list.json 和 Style Spine，为每个分镜生成符合目标平台最优语法的中英双语提示词，音频描述原生嵌入，无需额外制作音频。",
    mode: MODE,
    model,
    temperature: 0.5,
  }
}
```

---

### Task 11: 创建 ScriptWriter Agent

**Files:**
- Create: `src/agents/script-writer.ts`

**Step 1: 创建 ScriptWriter Agent 定义**
```typescript
import type { AgentConfig } from "@opencode-ai/sdk"
import type { AgentMode, AgentPromptMetadata } from "./types"

const MODE: AgentMode = "subagent"
export const SCRIPT_WRITER_PROMPT_METADATA: AgentPromptMetadata = {
  category: "specialist",
  cost: "CHEAP",
  triggers: [],
}

export function createScriptWriterAgent(model: string): AgentConfig {
  return {
    name: "script-writer",
    description: "叙事顾问。生成场景叙事文本、情绪节拍、对话/旁白，输出 scene_brief.json Artifact 供 Storyboarder 使用。",
    mode: MODE,
    model,
    temperature: 0.6,
  }
}
```

---

### Task 12: 更新 builtin-agents.ts 添加新 Agent

**Files:**
- Modify: `src/agents/builtin-agents.ts`

**Step 1: 添加新 Agent 导入**
```typescript
import { createDirectorAgent, DIRECTOR_PROMPT_METADATA } from "./director"
import { createStoryboarderAgent, STORYBOARDER_PROMPT_METADATA } from "./storyboarder"
import { createPrompterAgent, PROMPTER_PROMPT_METADATA } from "./prompter"
import { createScriptWriterAgent, SCRIPT_WRITER_PROMPT_METADATA } from "./script-writer"
```

**Step 2: 更新 agentSources**
```typescript
const agentSources: Record<BuiltinAgentName, AgentSource> = {
  director: createDirectorAgent,
  storyboarder: createStoryboarderAgent,
  prompter: createPrompterAgent,
  "script-writer": createScriptWriterAgent,
  "multimodal-looker": createMultimodalLookerAgent,
  metis: createMetisAgent,
  momus: createMomusAgent,
  atlas: createAtlasAgent as AgentFactory,
}
```

**Step 3: 更新 agentMetadata**
```typescript
const agentMetadata: Partial<Record<BuiltinAgentName, AgentPromptMetadata>> = {
  director: DIRECTOR_PROMPT_METADATA,
  storyboarder: STORYBOARDER_PROMPT_METADATA,
  prompter: PROMPTER_PROMPT_METADATA,
  "script-writer": SCRIPT_WRITER_PROMPT_METADATA,
  "multimodal-looker": MULTIMODAL_LOOKER_PROMPT_METADATA,
  metis: metisPromptMetadata,
  momus: momusPromptMetadata,
  atlas: atlasPromptMetadata,
}
```

---

## 阶段 3: 创建 director_task 工具

### Task 13: 创建 director_task 工具

**Files:**
- Create: `src/tools/director_task.ts`

**Step 1: 创建 director_task 工具定义**
```typescript
import type { ToolDefinition } from "@opencode-ai/plugin"

export function createDirectorTask(): ToolDefinition {
  return {
    name: "director_task",
    description: "将任务分发给分镜团队的子 Agent（Storyboarder、Prompter、ScriptWriter），返回分镜提示词文档。",
    inputSchema: {
      type: "object",
      properties: {
        task: {
          type: "string",
          description: "任务描述",
        },
        category: {
          type: "string",
          enum: ["storyboard", "prompt-engineering", "narrative", "quick"],
          description: "任务分类，决定使用哪个子 Agent",
        },
        style_spine: {
          type: "object",
          description: "Style Spine（视觉+音频风格定义）",
        },
        brief: {
          type: "string",
          description: "用户原始创意 Brief",
        },
      },
      required: ["task", "category"],
    },
  }
}
```

**Step 2: 更新 tools/index.ts 导出**
```typescript
export { createDirectorTask } from "./director_task"
```

---

## 阶段 4: 验证和测试

### Task 14: 运行 TypeScript 编译检查

**Files:**
- Test: 项目整体

**Step 1: 运行类型检查**
```bash
cd D:\Code\project\oh-my-opencinema
bun run typecheck
```

**Step 2: 修复任何类型错误**

---

### Task 15: 运行测试

**Files:**
- Test: 项目整体

**Step 1: 运行测试**
```bash
bun run test
```

---

## 执行选项

**Plan complete and saved to `docs/plans/2026-03-07-oh-my-opencinema-transform.md`. Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
