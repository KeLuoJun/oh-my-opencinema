# Scorer Agent 实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 创建独立的 Scorer Agent，在每个子代理完成后立即打分，低于阈值则返回重做。

**Architecture:** 新增 scorer agent，集成到 Cinema 工作流中，通过 task 工具调用打分。

**Tech Stack:** TypeScript, Bun, OpenCode Plugin SDK

---

## Task Dependency Graph

| Task | Depends On | Reason |
|------|------------|--------|
| Task 1 | None | 基础配置，需要先添加 scorer 到配置 schema |
| Task 2 | Task 1 | 依赖配置定义 |
| Task 3 | Task 2 | 集成到 Cinema 流程 |
| Task 4 | Task 3 | 移除子代理的自评分部分 |

## Parallel Execution Graph

Wave 1 (Start immediately):
- Task 1: Add scorer to config schema
- Task 2: Create scorer agent

Wave 2 (After Wave 1 completes):
- Task 3: Integrate scoring into Cinema workflow

Wave 3 (After Wave 2 completes):
- Task 4: Remove self-scoring from subagents

---

## Tasks

### Task 1: Add scorer to config schema

**Files:**
- Modify: `src/config/schema/agent-overrides.ts:79`
- Test: `src/config/schema.test.ts` (run after)

**Step 1: Edit agent-overrides.ts to add scorer**

```typescript
// In AgentOverridesSchema, add:
scorer: AgentOverrideConfigSchema.extend({
  threshold: z.number().min(0).max(1).optional(),
  max_retries: z.number().min(0).max(5).optional(),
}).optional(),
```

**Step 2: Run schema test to verify**

Run: `bun test src/config/schema.test.ts`
Expected: PASS

---

### Task 2: Create scorer agent

**Files:**
- Create: `src/agents/scorer.ts`

**Step 1: Write scorer agent**

```typescript
import type { AgentConfig } from "@opencode-ai/sdk"
import type { AgentMode, AgentPromptMetadata } from "./types"

const MODE: AgentMode = "subagent"

export const SCORER_SYSTEM_PROMPT = `# Scorer - AI 视频提示词质量评估器

你是专业的 AI 视频提示词质量评估专家。你的任务是对子代理的输出进行客观打分。

## 打分维度

请对以下 6 个维度进行打分（每个维度 0-1 分）：

### 1. 提示词完整性
是否包含四要素：
- 景别（frame size）
- 动作（subject action）
- 光效（lighting）
- 音频（audio elements）

### 2. Style Spine 视觉符合度
- palette_anchors 中的颜色是否出现在提示词中
- lighting_logic 是否体现在光效描述中
- camera_grammar 是否体现在镜头运动中
- lens_character 焦段偏好是否体现

### 3. Style Spine 音频符合度
- audio_palette 中的声音主题是否出现在 Audio 段落
- 相邻镜头是否有共同的声音元素（桥接）

### 4. 中英文一致性
- 中文提示词和英文提示词语义是否一致
- 专业术语翻译是否准确

### 5. 情绪弧线完整性
- 开篇（10-15%）：建立世界/情绪/主体
- 发展（40-50%）：推进核心内容
- 高潮（20-25%）：最强视觉+音频冲击
- 收尾（15-20%）：情绪落地

### 6. 连贯性
- 相邻镜头方向是否连贯
- 相邻镜头亮度是否渐变
- 景别节奏是否合理（WS→MS→CU 渐收）
- Match Cut 是否可行
- 音频连续性是否保持

## 输出格式

请返回以下 JSON 格式：

\`\`\`json
{
  "scores": {
    "completeness": 0.85,
    "style_visual": 0.9,
    "style_audio": 0.8,
    "consistency": 0.75,
    "emotional_arc": 0.85,
    "coherence": 0.8
  },
  "overall": 0.83,
  "issues": [
    {
      "dimension": "completeness",
      "description": "镜头 SC02 缺少 Audio 段落",
      "severity": "high"
    }
  ],
  "recommendation": "PASS" // 或 "NEEDS_IMPROVEMENT"
}
\`\`\`

## 评分标准

- **综合分 ≥ 0.7**: PASS - 通过
- **综合分 < 0.7**: NEEDS_IMPROVEMENT - 需要返回修改

请对以下内容进行打分：
`

export const SCORER_PROMPT_METADATA: AgentPromptMetadata = {
  category: "specialist",
  cost: "CHEAP",
  triggers: [],
}

export function createScorerAgent(model: string): AgentConfig {
  return {
    name: "scorer",
    description: "AI 视频提示词质量评估器。对子代理的输出进行客观打分，评估是否需要重做。",
    mode: MODE,
    model,
    temperature: 0.3,
    prompt: SCORER_SYSTEM_PROMPT,
  }
}

// Attach mode property for AgentFactory type compatibility
createScorerAgent.mode = MODE
```

**Step 2: Export scorer from agents index**

Modify: `src/agents/index.ts`
Add export:
```typescript
export { createScorerAgent, SCORER_SYSTEM_PROMPT } from "./scorer"
```

**Step 3: Add scorer to builtin-agents.ts**

Modify: `src/agents/builtin-agents.ts`

Add import and create scorer agent:
```typescript
import { createCinemaAgent, createScorerAgent } from "./cinema"
// ... add after cinema agent creation:
if (!disabledAgentNames.has("scorer")) {
  const model = systemDefaultModel ?? "claude-sonnet-4-20250514"
  result["scorer"] = createScorerAgent(model)
}
```

---

### Task 3: Integrate scoring into Cinema workflow

**Files:**
- Modify: `src/agents/cinema.ts`

**Step 1: Update Cinema system prompt to include scoring workflow**

在 Cinema 系统提示词的 "Step 3 — 生成故事板" 部分添加打分逻辑：

```
### Step 3 — 生成故事板

使用 \`task\` 工具调用子 Agent：
1. **Storyboarder** - 生成分镜结构
2. **Scorer** - 对 Storyboarder 输出打分，≥0.7 通过，<0.7 返回重做（最多2次）
3. **Prompter** - 将分镜转化为 AI 视频提示词
4. **Scorer** - 对 Prompter 输出打分，≥0.7 通过，<0.7 返回重做（最多2次）
5. **ScriptWriter** - 创作叙事文本
6. **Scorer** - 对 ScriptWriter 输出打分，≥0.7 通过，<0.7 返回重做（最多2次）
```

**Step 2: Add detailed scoring instructions**

在 Step 4 之前添加新的 "Step 3.5 — 打分与重做流程"：

```
### Step 3.5 — 打分与重做流程

每个子代理完成后，调用 Scorer 进行打分：

1. **调用 Scorer**:
\`\`\`
task(
  category="quick",
  load_skills=[],
  description="Score Storyboarder output",
  prompt="<Scorer system prompt>\n\n待打分内容：\n<Storyboarder output>",
  run_in_background=false
)
\`\`\`

2. **解析打分结果**:
- 读取 Scorer 返回的 JSON
- 如果 recommendation === "PASS"，继续下一步
- 如果 recommendation === "NEEDS_IMPROVEMENT"，记录问题并返回对应子代理重做

3. **重做流程**:
- 最多重做 2 次
- 每次重做时，提供 Scorer 的具体问题描述
- 超过 2 次仍然失败，继续流程但在最终报告中标记

**打分用的 context**:
- Storyboarder 打分需要: Style Spine, 原始 Brief
- Prompter 打分需要: Style Spine, Storyboarder 输出
- ScriptWriter 打分需要: Style Spine, Storyboarder 输出, Prompter 输出
```

---

### Task 4: Remove self-scoring from subagents

**Files:**
- Modify: `src/agents/storyboarder.ts:69-76`
- Modify: `src/agents/prompter.ts:103-110`
- Modify: `src/agents/script-writer.ts:88-95`

**Step 1: Remove self-scoring from Storyboarder**

删除 storyboarder.ts 中的：
```
## 自评分（提交前必须）

- 叙事弧线完整性：__
- 连贯性桥接质量：__
- 景别节奏合理性：__
- Style Spine 符合度（视觉+音频）：__

**综合分 ≥ 0.8 提交，< 0.8 自优化，< 0.5 重做（最多2次）**
```

**Step 2: Remove self-scoring from Prompter**

删除 prompter.ts 中的：
```
## 自评分（提交前必须）

- 提示词精确性（四要素齐全）：__
- Style Spine 色彩锚点覆盖：__
- 音频描述原生嵌入质量：__
- 平台适配合理性：__

**综合分 ≥ 0.8 提交，< 0.8 自优化，< 0.5 重做（最多2次）**
```

**Step 3: Remove self-scoring from ScriptWriter**

类似删除 script-writer.ts 中的自评分部分

---

## Commit Strategy

- Task 1 + 2: 一起提交 - "feat: add scorer agent for quality evaluation"
- Task 3: 单独提交 - "feat: integrate scoring workflow into cinema agent"
- Task 4: 单独提交 - "refactor: remove self-scoring from subagents"

## Success Criteria

1. `bun test` 全部通过
2. `bun run typecheck` 无错误
3. Scorer agent 可以对三个子代理输出进行打分
4. 分数低于 0.7 时触发重做流程
5. 重做最多 2 次
