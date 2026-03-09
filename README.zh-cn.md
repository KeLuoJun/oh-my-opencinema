# Oh My OpenCinema

<p align="right">
  <a href="./README.md">English</a> | <strong>简体中文</strong>
</p>

**一个用于 AI 视频分镜生成的 OpenCode 插件**

将视频创意自动转换为详细的分镜脚本，通过子代理自动编排工作流程。

---

## 快速开始

```bash
# 先安装 OpenCode，再添加插件
cd ~/.config/opencode
bun add oh-my-opencode
```

编辑 `~/.config/opencode/opencode.json`：

```json
{
  "plugin": ["oh-my-opencinema"]
}
```

然后运行 `opencode`，开始向 Cinema 代理描述你的视频创意。

---

## 代理架构

### 三层设计

```
用户 ↔ Cinema (主编)
           ↓ 任务委派
    Storyboarder (分镜统筹)
           ↓ 任务委派
    Prompter + ScriptWriter (内容生成)
```

### 代理团队

| 代理 | 角色 | 职责 |
|------|------|------|
| **cinema** | 主编 | 接收视频创意，生成 Style Spine，协调子代理，最终验收 |
| **storyboarder** | 分镜统筹 | 设计镜头结构，叙事弧线，分镜 breakdown，跨镜头连贯性规划 |
| **prompter** | 提示词工程师 | 将分镜转化为 AI 视频提示词，原生音频嵌入，中英双语输出 |
| **script-writer** | 叙事顾问 | 创建场景叙事，情绪节拍，对话/旁白 |
| **scorer** | 质量评估师 | 独立对每个子代理输出进行质量打分。6 个维度评分（≥0.7 通过，最多重试 2 次） |

### 工作流程

**Step 1 — 需求解析**
- Cinema 分析用户的视频 Brief
- 缺失信息时（时长、平台、比例、风格参考、角色、音频需求），一次性追问

**Step 2 — Style Spine 生成（必须首先完成）**
- 生成一致的视觉风格指南：
  - `aesthetic`：一句话定义整体视觉风格和时代感
  - `palette_anchors`：3-5 个具体颜色词
  - `lighting_logic`：主光源类型、方向、阴影处理方式
  - `camera_grammar`：摄影机语言偏好
  - `lens_character`：焦段偏好、景深风格
  - `motion_tempo`：节奏基调
  - `audio_world`：整体音频氛围定义
  - `audio_palette`：贯穿全片的声音主题
  - `scene_transitions`：转场方式
  - `forbidden_visual/audio`：绝对禁止的元素

**Step 3 — 故事板生成**
- Cinema 通过 `task` 工具委派给子代理：
  1. **Storyboarder** → 生成分镜结构（JSON artifact）
  2. **Scorer** → 打分（≥0.7 通过，<0.7 返回重做，最多 2 次）
  3. **Prompter** → 转化为 AI 视频提示词
  4. **Scorer** → 打分（≥0.7 通过，<0.7 返回重做，最多 2 次）
  5. **ScriptWriter** → 创作叙事文本
  6. **Scorer** → 打分（≥0.7 通过，<0.7 返回重做，最多 2 次）

**Step 4 — 验收与交付**
- Scorer 独立评估每个子代理
- Cinema 最终验收：
  - 每镜四要素（景别 + 动作 + 光效 + 音频）
  - Style Spine palette_anchors 出现在每条提示词
  - Audio palette 出现在 Audio 段落
  - 中英文语义一致
  - 情绪弧线完整

---

## 功能特性

- **自动委托** — Cinema 自动将任务委派给专业子代理
- **Style Spine 生成** — 为视频生成一致的视觉风格指南
- **多镜头规划** — 详细的分镜 breakdown
- **提示词工程** — 为 AI 视频生成工具优化提示词（Kling、Veo、Sora、Runway）
- **脚本撰写** — 叙事文本、字幕和对白
- **双语输出** — 每个镜头的中英双语提示词
- **原生音频嵌入** — 音频描述嵌入提示词
- **独立质量打分** — Scorer 代理对每个子代理输出进行独立评估，6 个维度（完整性、视觉风格符合度、音频风格符合度、一致性、情绪弧线、连贯性）。阈值 ≥0.7，不通过最多重试 2 次

---

## 配置

### 代理配置

为每个代理配置特定的 LLM 模型：

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

### 类别配置

配置任务委派的类别：

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

**模型配置优先级：**
1. 显式代理/类别模型配置
2. 代理覆盖模型
3. 类别解析模型
4. 从父代理继承（未配置时的默认值）

### 禁用Agent

```jsonc
{
  "disabled_agents": ["script-writer"]
}
```

---

## 使用方法

1. 在 OpenCode 中启动新会话
2. 向 Cinema 代理描述你的视频创意
3. Cinema 将自动编排分镜生成

**示例：**
```
为一个 30 秒的浪漫短片创建分镜，讲述两个角色在咖啡馆相遇的故事。
```

### 输出格式

Cinema 代理输出 Markdown 文档：
1. **制作概要** — 项目概览
2. **Style Spine** — 视觉与音频风格指南
3. **角色档案** — 角色描述
4. **分镜提示词** — 每个镜头的双语提示词（含 Audio）
5. **平台适配建议** — Kling/Veo/Sora/Runway 优化
6. **验收报告** — 质量检查清单

---

## 开发

```bash
# 安装依赖
bun install

# 构建插件
bun run build

# 运行测试
bun test

# 类型检查
bun run typecheck
```

---

## 许可证

SUL-1.0

---

## 相关链接

- [OpenCode 官方仓库](https://github.com/anomalyco/opencode)
- [Oh My OpenCinema GitHub](https://github.com/code-yeongyu/oh-my-opencinema)
