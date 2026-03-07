# 🎬 Oh My OpenCinema

> *基于 oh-my-opencode Fork 改造的 AI 视频分镜多 Agent 系统*
> *一句创意输入，输出含原生音频的完整分镜提示词文档*

---

## 一、项目定位

**项目名称**：Oh My OpenCinema（简称 `omoc`）

**核心命令**：`ultrashot`（对标 oh-my-opencode 的 `ultrawork`）

**npm 包名**：`oh-my-opencinema`

**与 newtype-profile 相同的改造路径**：
- Fork oh-my-opencode 仓库
- 在 `src/index.ts` 中**删除**原有的 Sisyphus、Hephaestus、Oracle、Librarian、Explore Agent 定义
- **添加**影视领域的全新 Agent 集合（Director、Storyboarder、Prompter、ScriptWriter）
- 将 `sisyphus_task` 工具改名为 `director_task`
- 重新定义任务分类系统（Categories）

**最终交付物**：
一份 Markdown 格式的分镜提示词文档，每个分镜包含：
- 视频生成提示词（中英双语），**原生内嵌音频/音效描述**，无需额外制作音频
- 跨平台适配建议（Kling / Veo 3 / Sora 2 / Runway）
- 整体 Style Spine 保障分镜视觉与听觉一致性

---

## 二、改造策略：对比 newtype-profile

| 对比维度 | oh-my-opencode（原版） | newtype-profile（内容创作） | Oh My OpenCinema（影视视频） |
|---|---|---|---|
| **保留底层** | — | ✅ Hook 体系、Background Agent、MCP、LSP 全部保留 | ✅ 同样全部保留 |
| **删除的 Agent** | — | Sisyphus、Hephaestus、Oracle、Librarian、Explore | Sisyphus、Hephaestus、Oracle、Librarian、Explore（完全相同） |
| **新增的 Agent** | — | Chief、Deputy、Researcher、Writer、Editor... | Director、Storyboarder、Prompter、ScriptWriter |
| **任务工具** | `sisyphus_task` | `chief_task` | `director_task` |
| **分类系统** | visual-engineering、deep、ultrabrain... | research、writing、editing、extraction... | storyboard、prompt-engineering、narrative、quick |
| **输出产物** | 代码 | Newsletter 文章 | 分镜提示词 Markdown 文档（含原生音频） |
| **用户入口** | Sisyphus（主 Agent） | Chief（主 Agent） | Director（主 Agent，唯一可见） |

---

## 三、核心设计理念

### 3.1 三个质量目标

**① 每个分镜精准且精彩**
提示词是给一个"从未看过分镜板的摄影师"的简报。每个镜头必须包含四要素：景别构图 + 主体动作（用动词短语，不用形容词）+ 光效色调 + 音频环境。每个镜头只做一件事：一个运镜 + 一个主体动作。

**② 分镜之间过渡舒适**
为每对相邻镜头设计"连接桥"：方向连贯（轴线规则）+ 亮度渐变（不突变超过2档）+ 景别节奏（避免同景别直切）+ Match Cut 机会标记。音频也需要连贯：相邻镜头共享同一个环境音主题。

**③ 分镜画风保持统一**
在预制作阶段建立 **Style Spine（风格脊柱）**——跨所有分镜的色彩锚点、摄影机语言偏好、音频风格基调和禁止元素清单。所有子 Agent 在 Style Spine 约束下工作。

### 3.2 音频集成：原生嵌入，无需额外制作

**支持原生音频的平台**（2025-2026）：
- **Kling 2.6+**：在提示词末尾添加 `Audio:` 段落，支持环境音 + 音乐风格 + 语音
- **Veo 3 / Veo 3.1**：原生支持音频生成，在提示词中直接描述声音元素
- **Runway Gen-4 Turbo**：通过 `sound_design` 参数描述音效

**音频描述四要素**（嵌入每个分镜提示词）：
```
Audio: [环境音/背景声] + [主体声音/动作音效] + [音乐风格，如有] + [对话/旁白，如有]
```

例：
```
Audio: distant ocean waves at low volume, hull creaking under gentle swell,
seagulls passing 40 meters overhead, no music, no dialogue
```

### 3.3 Style Spine（风格脊柱）

Style Spine 是贯穿所有分镜的视觉+听觉 DNA，Director 接收用户输入后优先建立：

```json
{
  "style_spine": {
    "aesthetic": "整体视觉风格一句话定义",
    "palette_anchors": ["3-5个具体颜色词"],
    "lighting_logic": "光效逻辑",
    "camera_grammar": "摄影机语言偏好",
    "lens_character": "镜头感描述",
    "motion_tempo": "节奏感，平均镜头时长",
    "audio_world": "整体音频氛围（自然/商业/电影配乐/无声等）",
    "audio_palette": "贯穿全片的声音主题（如：海浪+船木+海鸥）",
    "forbidden_visual": ["禁止的视觉元素"],
    "forbidden_audio": ["禁止的音频元素，如：背景音乐/字幕/画外音"]
  }
}
```

---

## 四、Agent 架构

### 4.1 总览

```
用户输入创意 Brief
       │
       ▼
┌─────────────────────┐
│      Director       │  ← Chief 层（唯一用户可见）
│    （总导演）         │    建立 Style Spine → 任务调度 → 最终验收
│  claude-opus-4-6    │
└──────────┬──────────┘
           │ director_task 调用
           ▼
┌─────────────────────┐
│    Storyboarder     │  ← Deputy 层（hidden）
│   （分镜统筹）        │    叙事结构 + 连贯性设计 + 调度子 Agent
│ claude-sonnet-4-6   │
└──────────┬──────────┘
           │ 并行调用
     ┌─────┴──────────┐
     ▼                ▼
┌──────────┐    ┌──────────┐
│  Script  │    │ Prompter │  ← Specialist 层（hidden）
│  Writer  │    │(提示词师) │    各自专项深度生产
│  gemini  │    │  gemini  │
└──────────┘    └──────────┘
                     │
                     ▼
          📄 分镜提示词 Markdown 文档
             （每个分镜含原生音频描述）
```

### 4.2 各 Agent 详细设计

---

#### Director（总导演）— 用户唯一入口

| 属性 | 值 |
|---|---|
| 对应 oh-my-opencode | 替换 Sisyphus |
| OpenCode mode | `primary` |
| 模型 | `anthropic/claude-opus-4-6` |
| temperature | 0.4 |
| 用户可见 | ✅ 是 |

**核心职责**：
1. 解析用户 Brief，识别场景类型与平台偏好
2. **优先建立 Style Spine**（含视觉 + 音频两部分）
3. 若 Brief 模糊，一次性追问关键缺失信息
4. 将 Style Spine + 结构化任务通过 `director_task` 下发给 Storyboarder
5. 收到文档后逐项验收，不达标则驱动 Retake Loop

**Director 系统 Prompt**（`agents/director.md`）：

```markdown
---
name: Director
description: Oh My OpenCinema 的总导演，也是用户唯一交互的 Agent。建立视觉风格脊柱，调度分镜团队，验收最终输出的分镜提示词文档。
mode: primary
model: anthropic/claude-opus-4-6
temperature: 0.4
color: "#E8A838"
---

你是 Oh My OpenCinema 的总导演。你的工作哲学：在任何画面落地之前，先建立秩序。

## 工作流程

### Step 1 — 需求解析
接收用户创意 Brief。如以下信息缺失，一次性追问（不分多轮）：
- 目标时长（10s / 30s / 60s / 更长）
- 目标平台（Kling / Veo / Sora / Runway / 不指定）
- 视频比例（16:9 / 9:16 / 1:1）
- 视频用途（广告 / 短片 / MV / 产品展示 / 纪录片 / 其他）
- 风格参考（如有，例：参考《银翼杀手2049》色调）
- 是否有角色（如有，描述外貌、服装、标志特征）
- 是否需要对话/旁白/特定音乐

### Step 2 — 建立 Style Spine（必须首先完成）
生成 JSON 格式的 Style Spine，视觉与音频缺一不可：

```json
{
  "style_spine": {
    "aesthetic": "一句话定义整体视觉风格和时代感",
    "palette_anchors": ["3-5个具体颜色词，如 burnt amber, dusty teal"],
    "lighting_logic": "主光源类型、方向、阴影处理方式",
    "camera_grammar": "摄影机语言偏好，如 Handheld 60% + Tripod 40%",
    "lens_character": "焦段偏好、景深风格、光晕处理",
    "motion_tempo": "节奏基调，平均镜头时长建议",
    "audio_world": "整体音频氛围定义（写实环境音 / 商业配乐 / 电影原声 / 极简主义 等）",
    "audio_palette": ["贯穿全片的声音主题，如：ocean waves / hull creak / distant seagulls"],
    "scene_transitions": "转场方式（hard cut / dissolve / match cut / whip pan）",
    "forbidden_visual": ["绝对禁止的视觉元素"],
    "forbidden_audio": ["绝对禁止的音频元素，如：upbeat pop music / voiceover / sound effects only"]
  }
}
```

### Step 3 — 任务下发
将 Style Spine + Brief + 技术规格通过 `director_task` 传递给 Storyboarder。

### Step 4 — 验收（Retake Loop）
收到分镜文档后，逐项检查：
- [ ] 每个分镜是否包含四要素（景别 + 动作 + 光效 + 音频）
- [ ] Style Spine 的 palette_anchors 是否出现在每条提示词中
- [ ] Style Spine 的 audio_palette 是否出现在每条提示词的 Audio 段落
- [ ] 中英文提示词语义是否一致
- [ ] 分镜叙事是否有完整的情绪弧线（开篇→发展→高潮→收尾）
- [ ] 相邻分镜之间的连接桥逻辑是否设计

综合质量分 ≥ 0.85 通过，否则指出具体问题，触发 Retake Loop，返回 Prompter。
```

---

#### Storyboarder（分镜统筹）— 隐藏

| 属性 | 值 |
|---|---|
| 对应 oh-my-opencode | 替换 Hephaestus |
| OpenCode mode | `subagent` + `hidden: true` |
| 模型 | `anthropic/claude-sonnet-4-6` |
| temperature | 0.3 |

**核心职责**：规划叙事结构、设计连贯性桥接、调度子 Agent、汇总 Artifact

**Storyboarder 系统 Prompt**（`agents/storyboarder.md`）：

```markdown
---
name: Storyboarder
description: 分镜统筹。接收 Style Spine 和 Brief，规划完整镜头结构，设计跨镜头连贯性桥接，调度 ScriptWriter 和 Prompter，汇总 Artifact 返回 Director。
mode: subagent
model: anthropic/claude-sonnet-4-6
hidden: true
temperature: 0.3
---

你是分镜统筹。你的使命：让观众看到视频时感觉"这些镜头本来就应该在一起"。

## 叙事结构原则

根据目标时长分配叙事弧线段落比例：
- **开篇**（10-15%时长）：建立世界/情绪/主体，用宽景别（EWS/WS）
- **发展**（40-50%时长）：推进核心内容，景别渐收，节奏加快
- **高潮**（20-25%时长）：最强视觉+音频冲击，最紧张的剪辑节奏
- **收尾**（15-20%时长）：情绪落地，回归宽景别或特写凝固

## 连贯性设计（为每对相邻镜头）

为每个镜头填写 `bridge_to_next` 字段，说明与下一镜头的连接逻辑：

1. **方向连贯**：主体运动方向在相邻镜头中保持一致（轴线规则）
2. **亮度渐变**：相邻镜头亮度不突变超过 2 档
3. **景别节奏**：WS→MS→CU 渐收节奏，避免同景别直接跳切
4. **Match Cut**：识别可做动作匹配剪辑的镜头对并标记
5. **音频连续性**：相邻镜头共享相同的环境音主题，以保持沉浸感
6. **动作尾帧**：动作类镜头在动作结束后留 0.5-1 秒静止，供剪辑过渡用

## 输出格式（必须 JSON Artifact）

```json
{
  "project_title": "项目名称",
  "style_spine": { "...从 Director 完整继承..." },
  "character_bible": {
    "角色名": {
      "appearance": "外貌精确描述（每次提示词必须逐字复用）",
      "wardrobe": "服装细节",
      "distinguishing": "标志性特征"
    }
  },
  "shots": [
    {
      "id": "SC01",
      "timecode": "0:00-0:08",
      "duration_s": 8,
      "narrative_phase": "opening",
      "scene_context": "场景文字描述",
      "frame_size": "EWS",
      "camera_movement": "Slow Dolly In",
      "subject_action": "单一动作，动词短语",
      "lighting": "光效描述（必须包含 palette_anchors 中的颜色）",
      "audio_elements": {
        "ambience": "环境音描述",
        "subject_sounds": "主体发出的声音",
        "music": "音乐描述或 null",
        "dialogue": "对话内容或 null",
        "audio_volume": "relative volume level: low/medium/high"
      },
      "bridge_to_next": "与下一镜头的连接逻辑",
      "emotional_beat": "这个镜头的情绪目标",
      "recommended_platform": "Kling/Sora/Veo/Runway",
      "qc_notes": ""
    }
  ]
}
```

## 自评分（提交前必须）
- 叙事弧线完整性：__
- 连贯性桥接质量：__
- 景别节奏合理性：__
- Style Spine 符合度（视觉+音频）：__

综合分 ≥ 0.8 提交，< 0.8 自优化，< 0.5 重做（最多2次）。
```

---

#### Prompter（提示词工程师）— 隐藏，最核心

| 属性 | 值 |
|---|---|
| 对应 oh-my-opencode | 新增（无对应） |
| OpenCode mode | `subagent` + `hidden: true` |
| 模型 | `google/gemini-2.5-pro` |
| temperature | 0.5 |

**Prompter 系统 Prompt**（`agents/prompter.md`）：

```markdown
---
name: Prompter
description: AI 视频提示词工程师。接收 shot_list.json 和 Style Spine，为每个分镜生成符合目标平台最优语法的中英双语提示词，音频描述原生嵌入，无需额外制作音频。
mode: subagent
model: google/gemini-2.5-pro
hidden: true
temperature: 0.5
---

你是 AI 视频提示词工程师。加载 cinematography 和 video-prompt 两个 Skill。

## 提示词生成铁律

1. **Style Spine 优先**：aesthetic 描述放提示词开头，奠定全部后续细节的解读基调
2. **色彩锚点必须出现**：palette_anchors 中的所有颜色词必须出现在每条提示词的 Palette 段落
3. **动词替代形容词**：❌ "moves quickly" → ✅ "takes three steps, pauses, turns 30 degrees left"
4. **物理化描述**：描述力和材质而非结果：❌ "strong wind" → ✅ "12mph crosswind from camera-left"
5. **一镜一事**：一个运镜 + 一个主体动作。复杂动作拆分多镜头
6. **嵌入排除词**：把不想要的元素写进提示词末尾
7. **音频原生嵌入**：每条提示词必须包含 Audio 段落（见下方格式）

## 音频描述格式（每条提示词必须包含）

**Kling / Veo 格式**（放在提示词末尾 Audio 段落）：
```
Audio: [环境音，含距离感描述] [主体声音/动作音效] [音乐风格，或 no music]
[对话内容（加引号），或 no dialogue] [整体音量：quiet/moderate/immersive]
```

示例：
```
Audio: distant ocean waves at low-moderate volume, hull wood creaking under gentle swell,
seagulls calling 40 meters overhead, no music, no dialogue, immersive natural soundscape
```

**Sora 2 格式**（单独段落）：
```
Audio:
- Ambience: [环境音描述]
- Subject sounds: [主体相关声音]
- Music: [音乐或 none]
- Dialogue: "[具体台词]" 或 none
```

**关键原则**：
- audio_palette 中定义的声音主题必须在每个相关镜头出现，保持音频连续性
- 相邻镜头 Audio 段落中应有至少一个共同的声音元素（沉浸感桥接）
- 使用具体的声音描述词而非模糊词：❌ "loud sounds" → ✅ "metal door slams at close range"

## 角色描述复用规则
若 character_bible 中有角色定义，每次涉及该角色的提示词必须逐字粘贴外貌描述原文，不得改写。这是保障角色跨镜一致性的唯一方法。

## 自评分（提交前必须）
- 提示词精确性（四要素齐全）：__
- Style Spine 色彩锚点覆盖：__
- 音频描述原生嵌入质量：__
- 平台适配合理性：__

综合分 ≥ 0.8 提交，< 0.8 自优化，< 0.5 重做（最多2次）。
```

---

#### ScriptWriter（叙事顾问）— 隐藏

| 属性 | 值 |
|---|---|
| 对应 oh-my-opencode | 替换 Librarian |
| OpenCode mode | `subagent` + `hidden: true` |
| 模型 | `google/gemini-2.5-pro` |
| temperature | 0.6 |

**职责**：生成场景叙事文本、情绪节拍、对话/旁白，输出 `scene_brief.json` Artifact 供 Storyboarder 使用。

---

## 五、Skills（专业知识库）

### 5.1 `skills/cinematography/SKILL.md`

```markdown
---
name: cinematography
description: 专业摄影语言词汇库。Prompter 生成提示词时自动加载。
---

# 摄影语言 Skill

## 景别（Frame Size）

| 缩写 | 名称 | 取景范围 | 叙事功能 |
|---|---|---|---|
| ECU | 极特写 | 眼睛/手指等极小细节 | 强调情绪或质感细节 |
| CU | 特写 | 面部 | 情感揭示，角色内心 |
| MCU | 中近景 | 胸部以上 | 对话/情感，主流景别 |
| MS | 中景 | 腰部以上 | 行为/关系 |
| MWS | 中全景 | 全身+少量环境 | 人物与空间的关系 |
| WS | 全景 | 全身+较多环境 | 环境建立，空间交代 |
| EWS | 超远景 | 人物极小或无人 | 宏观建立，孤独感，壮阔感 |

**景别节奏规则**：
- 避免同景别直接跳切（CU→CU 突兀）
- 经典进入序列：EWS→WS→MS→CU（由远及近建立世界感）
- 高潮后释放：CU→WS（情感爆发后的空间感）

## 运镜（Camera Movement）

| 运镜 | 英文 | 叙事含义 | 使用场景 |
|---|---|---|---|
| 推镜 | Slow dolly-in | 亲密感、发现感、紧张 | 角色顿悟、情绪高涨 |
| 拉镜 | Slow dolly-out | 疏离、孤独、结束 | 分别、宏观揭示 |
| 横摇 | Slow pan left/right | 追踪/展示空间 | 揭示新信息、追踪动作 |
| 纵摇 | Slow tilt up/down | 仰望/俯视 | 权力感/弱小感 |
| 跟拍 | Camera tracks with subject | 投入感、同步情绪 | 跟随运动主体 |
| 手持 | Handheld, subtle shake | 真实感、紧张感 | 纪录风格、冲突场景 |
| 稳定跟拍 | Smooth steadicam follow | 流畅优雅，身临其境 | 进入空间、展示场所 |
| 焦点转移 | Rack focus from BG to FG | 注意力转移 | 引导观众视线 |
| 甩镜 | Fast whip pan | 时间跳跃、能量感 | 转场、MV、快节奏 |
| 升降 | Slow crane rise | 宏大感、揭示全貌 | 宏观揭示、开篇/结尾 |

**铁律**：每个镜头只用一个运镜。

## 光效（Lighting）

| 光效 | 情绪 | 典型场景 |
|---|---|---|
| Golden Hour | 温暖、怀旧、史诗感 | 情感高潮、结尾 |
| Blue Hour | 忧郁、神秘、诗意 | 开篇、过渡段 |
| High Key | 商业感、清洁、正能量 | 广告、产品 |
| Low Key | 悬疑、戏剧、电影感 | 冲突、转折 |
| Rembrandt | 人文、艺术、深度 | 人物特写 |
| Practical Lights | 真实感、生活感 | 室内场景 |
| Hard Light | 对抗、力量、戏剧 | 对峙、挑战 |
| Soft Light | 温柔、梦幻 | 商业美、产品展示 |
| Anamorphic Flare | 电影感、史诗感 | 宽幅电影风格 |
| Rim Light | 剪影感、神圣感 | 主体与背景分离 |

## 画质与风格描述词

**质感**：photorealistic / cinematic / IMAX quality / film grain / 35mm film / 16mm film
**景深**：shallow depth of field / deep focus / bokeh background / sharp throughout
**风格**：documentary style / handheld reportage / studio polished / commercial clean / noir
```

---

### 5.2 `skills/video-prompt/SKILL.md`

```markdown
---
name: video-prompt
description: 各主流 AI 视频平台的提示词最优语法规范，含原生音频生成格式。Prompter 生成提示词时必须加载。
---

# AI 视频提示词平台规范 Skill（含原生音频）

## 通用黄金法则

1. **Style 前置**：风格/美学词放开头，奠定全片基调
2. **色彩锚点**：每条提示词命名 3-5 个具体颜色词，稳定跨镜色调
3. **动词替代形容词**："jogs three steps and stops" 优于 "moves quickly"
4. **物理明确**：描述力和材质（"wet nylon jacket"，"8mph crosswind from camera-left"）
5. **一镜一事**：一个运镜 + 一个主体动作
6. **排除词内嵌**：把不想要的元素写在提示词末尾（不用单独 negative prompt 栏）
7. **音频必须嵌入**：每条提示词必须包含 Audio 段落，描述环境音 + 主体声音 + 音乐/无音乐

---

## Kling 平台规范（支持原生音频：Kling 2.6+）

**最优提示词结构**：
```
[美学锚点]. [主体描述]. [动作描述]. [场景/环境].
[摄影机语言]. [光效]. Palette: [颜色词列表].
[时长]. [画质].
Audio: [环境音+距离感] [主体声音] [音乐风格或 no music] [对话或 no dialogue].
Avoid: [排除元素列表].
```

**Kling 音频技巧**：
- 指定声音的空间感（"at close range" / "20 meters away" / "in the distance"）
- 音量层次：`low-volume background` / `moderate ambient` / `prominent foreground sound`
- 音乐描述格式：`[风格] instrumental music, [节奏] tempo, [情绪] mood`
- 对话格式：`Character says: "[具体台词]" in [语气] tone`

**Kling 示例（含音频）**：
```
90s documentary film style, 35mm grain texture. Close-up of a man in his 40s,
dark curly hair with silver strands, weathered dark gray fisherman sweater.
He slowly raises his head, jaw set, eyes narrowing slightly. Wet fishing deck behind him.
Camera: static tripod, slight telephoto compression.
Lighting: overcast diffuse daylight, no direct shadows, low key mood.
Palette: slate gray, warm ivory, ocean teal, rust brown, charcoal.
Duration: 6 seconds, 24fps, 4K.
Audio: moderate ocean wave ambience, wet deck underfoot as subject shifts weight,
distant seagulls, no music, no dialogue, immersive natural soundscape.
Avoid dutch angle, avoid lens flare, avoid modern elements, avoid background motion artifacts.
```

---

## Veo 3 / Veo 3.1 平台规范（原生音频支持最强）

**Veo 3 音频支持**：最佳原生音频生成平台，提示词中的音频描述会被精确执行。

**最优提示词结构**：
```
[Shot framing and motion]. [Style]. [Lighting]. [Character/Subject description].
[Location/Environment]. [Action]. [Palette: 颜色词].
Audio: [环境音描述] [动作音效] [音乐或 no music] [对话（加引号）或 no dialogue].
[Duration].
```

**Veo 3 音频技巧**：
- 支持帧连接（Frame Conditioning）：上一镜头最后帧作为参考图，跨镜一致性强
- 音频描述与画面描述等权重，详细的音频描述会提升生成质量
- 环境音描述遵循层次：`primary ambient` + `secondary ambient` + `incidental sounds`

**Veo 3 示例（含音频）**：
```
A slow zoom on a fisherman's weathered face as he stares at the horizon. Handheld documentary style.
Soft overcast morning light, diffuse shadows, cool steel-blue atmosphere.
Subject: man in his 40s, dark curly hair with silver, faded navy jacket, rope-burned hands.
Location: small wooden fishing boat bow, gray Baltic sea, low horizon.
Action: He squints slightly, left hand grips the rail, right hand lifts a cigarette slowly.
Palette: ocean teal, charcoal gray, warm ivory, rust brown.
Audio: persistent ocean wave sound at moderate volume, hull wood creaking rhythmically,
distant foghorn at very low volume, wind at 8mph creating subtle jacket rustle, no music, no dialogue.
Duration: 8 seconds.
```

---

## Sora 2 平台规范（结构化音频段落）

**最优提示词结构**（OpenAI 推荐格式 + 音频段落）：
```
[Style/Aesthetic anchor]. [Scene description].
Cinematography:
  Camera: [framing, motion].
  Lens: [focal length, DOF].
  Lighting: [sources, quality, direction].
  Palette: [colors].
Actions:
  - [Action beat 1]
  - [Action beat 2]
  - [Action beat 3]
Audio:
  - Ambience: [环境音]
  - Subject sounds: [主体声音]
  - Music: [音乐描述或 none]
  - Dialogue: "[台词]" 或 none
[Duration]. [Negative constraints].
```

**Sora 2 示例（含音频）**：
```
90s documentary style, 16mm film grain, muted and slightly faded color palette.
A weathered fisherman sits at the bow of a small wooden boat on calm gray water.
Cinematography:
  Camera: medium shot, static tripod.
  Lens: 50mm, shallow focus on face.
  Lighting: overcast diffuse daylight, no direct sun.
  Palette: slate gray, warm ivory, ocean teal, rust brown.
Actions:
  - He stares at the horizon, jaw set, eyes squinting slightly
  - Wind ruffles his jacket; he doesn't react
  - He slowly raises a cigarette to his lips
Audio:
  - Ambience: ocean waves at moderate volume, boat hull creaking gently
  - Subject sounds: fabric rustle as arm raises, faint exhale
  - Music: none
  - Dialogue: none
Duration: 7 seconds. Avoid color grading artifacts, no modern elements in background.
```

---

## Runway Gen-4 Turbo 平台规范

**音频支持**：通过 `sound_design` 参数描述音效（目前不支持对话生成）。

**最优提示词结构**：
```
[Style]. [Subject with material description]. [Action with physics/force description].
[Camera]. [Environment]. [Lighting]. Palette: [colors].
Sound design: [音效描述，侧重物理音效和环境音]. [Duration].
```

**Runway 示例（含音频）**：
```
High-end commercial product shot. A heavy crystal whiskey glass on dark walnut wood.
Warm amber liquid inside, approximately 40ml.
Camera: extreme close-up macro, static.
Lighting: single hard key light from upper-right creating caustics through glass.
Palette: amber gold, deep mahogany, warm ivory, shadow black.
Action: ice cube slowly shifts 2mm, micro-condensation forms on glass surface.
Physics: glass remains rigid; only liquid and ice move.
Sound design: soft crystal resonance as ice shifts, gentle liquid settling sound,
subtle room tone at low volume, no music.
Duration: 6 seconds. No camera movement. Avoid motion artifacts on glass surface.
```

---

## Style Spine 注入模板

每条提示词必须包含以下来自 Style Spine 的元素：

**视觉注入**：
```
[style_spine.aesthetic] ... Palette: [style_spine.palette_anchors] ...
[style_spine.lighting_logic中的光效] ... [style_spine.camera_grammar中的摄影机风格] ...
Avoid: [style_spine.forbidden_visual]
```

**音频注入**：
```
Audio: [style_spine.audio_palette 中的声音主题] ... [本镜头特有的主体声音] ...
[style_spine.audio_world 的基调：no music / subtle instrumental / 等] ...
Avoid audio: [style_spine.forbidden_audio]
```
```

---

## 六、最终输出文档格式

`output/[project-name]-storyboard.md`

```markdown
# 🎬 [项目名称] — AI 视频分镜提示词文档

> 由 Oh My OpenCinema 自动生成 | 生成时间：YYYY-MM-DD
> ⚠️ 每个分镜的提示词均内嵌音频描述，使用 Kling 2.6+ 或 Veo 3 可直接生成含音频的视频片段

---

## 📋 制作概要

| 字段 | 内容 |
|---|---|
| 创意 Brief | 用户原始输入 |
| 总时长 | XX 秒 |
| 镜头总数 | XX 个 |
| 目标平台 | Kling 3.0（角色镜头）/ Veo 3.1（环境镜头） |
| 视频比例 | 16:9 |
| 帧率 | 24fps |
| 音频策略 | 原生嵌入（无需额外制作），通过提示词中的 Audio 段落生成 |

---

## 🎨 Style Spine（视觉风格脊柱）

| 属性 | 值 |
|---|---|
| 整体美学 | 90年代胶片感纪录片，颗粒质感，手持摄影 |
| 色彩锚点 | `burnt amber` · `dusty teal` · `warm ivory` · `charcoal gray` · `rust brown` |
| 光效逻辑 | 自然光为主，侧光强化轮廓，保留阴影细节，无人工补光感 |
| 摄影机语言 | Handheld 60% + Static Tripod 40%，无 CGI 感，无 drone |
| 镜头感 | 35mm 球面镜，中等景深，偶有 Anamorphic 光晕 |
| 节奏 | 慢节奏，平均镜头时长 6-8 秒 |
| **音频氛围** | **写实自然音景，无配乐，环境音为主** |
| **音频主题** | **ocean waves · hull creak · seagulls · wind rustle** |
| 禁止视觉 | Dutch Angle / 快速变焦 / 霓虹色调 / 过饱和 / CGI 材质 |
| 禁止音频 | 背景音乐 / 旁白 / 非自然音效 |

---

## 👤 角色档案（Character Bible）

> 每个含角色的分镜提示词，必须逐字复用以下描述

### 主角
- **外貌**：40多岁男性，深色蜷曲头发略带银丝，方下颌，三天络腮胡，皮肤粗糙
- **服装**：深灰色渔夫毛衣，深蓝色做旧牛仔外套，黑色橡胶靴
- **标志特征**：右手食指有旧伤疤，双手布满绳索摩擦痕迹

---

## 🎞️ 分镜提示词

### SC01 — 序幕：无声的海（0:00 - 0:08）

**情绪目标**：建立孤独与辽阔，观众感受主角与大海的深厚联系

**景别 / 运镜**：`EWS` / 极缓慢 Dolly In

**连接到 SC02**：空镜收尾 → SC02 以主角背影开场，Hard Cut，方向连贯

---

🇨🇳 **中文提示词**

> 90年代胶片感纪录片风格，35mm颗粒感。超远景，清晨低角度金色晨光斜射，海平面上一艘极小的渔船静止漂浮，四周是茫茫灰蓝色海面，略有云层。色彩锚点：burnt amber, dusty teal, warm ivory, charcoal gray, rust brown。镜头极缓慢向前推进。画面静谧辽阔，充满孤独感。8秒，24fps。
>
> 音频：中等音量的持续海浪声，偶尔海鸥叫声从远处经过，极低音量的船体轻微摇晃声，无音乐，无人声，沉浸式自然音景。
>
> 禁止：Dutch Angle，过饱和，画面闪烁，快速运动，任何人工音效。

🇺🇸 **英文提示词**

> 90s documentary film style, 35mm grain texture. Extreme wide shot. Low-angle golden hour light
> raking across the sea at dawn, a tiny fishing boat sits motionless on a vast gray-blue expanse,
> layered cloud formations above. Palette: burnt amber, dusty teal, warm ivory, charcoal gray, rust brown.
> Camera: extremely slow dolly-in, no other motion. Mood: vast, solitary, meditative. 8 seconds, 24fps.
>
> Audio: persistent ocean waves at moderate volume, seagulls passing in the far distance,
> very low hull settling sound, no music, no dialogue, immersive natural soundscape.
>
> Avoid: dutch angle, oversaturation, flickering artifacts, rapid motion, artificial sound effects.

**📱 平台适配**

| 平台 | 推荐度 | 备注 |
|---|---|---|
| Veo 3.1 | ⭐⭐⭐⭐⭐ | 最优选，风景+原生音频双强 |
| Kling 3.0 | ⭐⭐⭐⭐ | 运动幅度极低，Kling 2.6+ 支持原生音频 |
| Sora 2 | ⭐⭐⭐ | 物理细节好，Audio 段落用结构化格式 |

---

### SC02 — 建立：背影与晨光（0:08 - 0:15）

**情绪目标**：引入主角，保持神秘感，建立人物与大海的关系

**景别 / 运镜**：`WS` / Static Tripod（固定）

**连接到 SC03**：WS 背影 → SC03 MS 侧面，Match Cut 在角色转身动作处

---

🇨🇳 **中文提示词**

> 90年代胶片感纪录片风格，35mm颗粒感。全景，固定三脚架。40多岁男性（深色蜷曲略带银丝头发，深灰色渔夫毛衣，深蓝色做旧牛仔外套，黑色橡胶靴，右手食指有旧伤疤，双手布满绳索摩擦痕迹）背对镜头站在渔船船头，面向大海。晨光从背后射入，边缘光勾勒轮廓，形成剪影。色彩锚点：burnt amber, dusty teal, warm ivory, charcoal gray, rust brown。主角静止不动，海面微波。7秒，24fps。
>
> 音频：海浪声保持与上一镜头一致的中等音量，风声轻抚布料发出轻微摩擦声，远处海鸥叫声，木质船板轻微吱呀声，无音乐，无对话。
>
> 禁止：角色正面可见，过曝，画面噪点过重，任何现代元素。

🇺🇸 **英文提示词**

> 90s documentary film style, 35mm grain texture. Wide shot, static tripod.
> A man in his 40s (dark curly hair with silver strands, dark gray fisherman sweater,
> faded navy denim jacket, black rubber boots, old scar on right index finger,
> rope-worn hands) stands at the bow of a fishing boat, back to camera, facing the open sea.
> Morning backlight creates a silhouette with warm rim light tracing his outline.
> Palette: burnt amber, dusty teal, warm ivory, charcoal gray, rust brown.
> Subject remains still; gentle sea surface motion only. 7 seconds, 24fps.
>
> Audio: ocean waves continuing at same moderate volume as previous shot,
> soft wind causing light fabric rustle, distant seagulls at low volume,
> wooden deck settling sound, no music, no dialogue.
>
> Avoid: character face visible, overexposure on silhouette, heavy digital noise, modern background elements.

**📱 平台适配**

| 平台 | 推荐度 | 备注 |
|---|---|---|
| Kling 3.0 | ⭐⭐⭐⭐⭐ | 最优选，静止角色 + 原生音频 |
| Veo 3.1 | ⭐⭐⭐⭐ | 可用，静止人物场景稳定 |

---

[... SC03 ～ SC0N 格式相同，依叙事弧线排列 ...]

---

## ⚙️ 技术规格

| 参数 | 值 |
|---|---|
| 总时长 | 60 秒 |
| 单镜头时长 | 5 ～ 10 秒 |
| 分辨率 | 1920×1080（16:9）|
| 帧率 | 24fps |
| 音频策略 | **原生嵌入**：每条提示词含 Audio 段落，Kling 2.6+ / Veo 3 可直接生成含音频视频 |
| 合成顺序 | SC01 → SC0N 按 timecode 顺序剪辑 |
| 推荐剪辑工具 | DaVinci Resolve / CapCut |

---

## 📊 Director 验收报告

| 检查项 | 状态 |
|---|---|
| 四要素齐全（景别/运镜/光效/音频） | ✅ |
| Style Spine 色彩锚点覆盖 | ✅ |
| Style Spine 音频主题覆盖 | ✅ |
| 中英文提示词语义一致 | ✅ |
| 叙事弧线完整 | ✅ |
| 连接桥设计（跨镜连贯性） | ✅ |
| 角色 Character Bible 逐字复用 | ✅ |
| 质量评分 | **0.93 / 1.00** ✅ |
```

---

## 七、基于 oh-my-opencode 的代码修改说明

### 7.1 改造方式

参照 newtype-profile 的路径：**Fork oh-my-opencode，在 `src/index.ts` 中替换 Agent 集合**。

| 步骤 | 操作 |
|---|---|
| **Fork** | `git clone https://github.com/code-yeongyu/oh-my-opencode.git oh-my-opencinema` |
| **删除原有 Agent 定义** | 在 `src/index.ts` 中移除 Sisyphus、Hephaestus、Oracle、Librarian、Explore 的 Agent 对象定义 |
| **删除原有任务工具** | 移除 `sisyphus_task` 工具定义 |
| **添加新 Agent** | 添加 Director、Storyboarder、Prompter、ScriptWriter 的定义 |
| **添加新工具** | 添加 `director_task` 工具（路由逻辑同 `sisyphus_task`，Categories 重新定义） |
| **保留底层** | Hook 体系、Background Agent、MCP（含 Exa websearch）、LSP、AST-Grep 全部保留不动 |

### 7.2 `src/agents/` 目录改造

**删除**（oh-my-opencode 原有的 Agent 定义文件）：
```
src/agents/sisyphus.ts
src/agents/hephaestus.ts
src/agents/oracle.ts
src/agents/librarian.ts
src/agents/explore.ts
src/agents/prometheus.ts   ← 可选保留，作为策划顾问
```

**新增**（Oh My OpenCinema 的 Agent 定义文件）：
```
src/agents/director.ts          ← 主 Agent，替代 Sisyphus
src/agents/storyboarder.ts      ← 分镜统筹，替代 Hephaestus
src/agents/prompter.ts          ← 提示词工程师，全新
src/agents/script-writer.ts     ← 叙事顾问，替代 Librarian
```

### 7.3 `src/tools/director_task.ts` — 核心工具（替换 sisyphus_task）

```typescript
// director_task.ts
// 参照 sisyphus_task 的路由逻辑，重新定义 Categories

export const DIRECTOR_CATEGORIES = {
  // 分镜设计类任务 → Storyboarder（Sonnet）
  "storyboard": {
    description: "镜头结构规划、叙事弧线设计、连贯性桥接",
    default_agent: "storyboarder",
    model: "anthropic/claude-sonnet-4-6",
    temperature: 0.3
  },
  // 提示词生成类任务 → Prompter（Gemini Pro）
  "prompt-engineering": {
    description: "将分镜描述转化为 AI 视频生成提示词（含音频）",
    default_agent: "prompter",
    model: "google/gemini-2.5-pro",
    temperature: 0.5
  },
  // 叙事/剧本类任务 → ScriptWriter（Gemini Pro）
  "narrative": {
    description: "场景叙事文本、情绪节拍、对话旁白",
    default_agent: "script-writer",
    model: "google/gemini-2.5-pro",
    temperature: 0.6
  },
  // 快速轻量任务 → 快速模型
  "quick": {
    description: "简单格式化、单字段修改等轻量任务",
    default_agent: "script-writer",
    model: "google/gemini-2.5-flash",
    temperature: 0.3
  }
} as const;
```

### 7.4 `oh-my-opencode.jsonc` 配置文件

用户级配置 `~/.config/opencode/oh-my-opencode.json` 或项目级 `.opencode/oh-my-opencode.json`：

```jsonc
{
  // 根据 newtype-profile 的模式，通过 Google Antigravity 访问多模型
  // "google_auth": true,  // 若使用 Google Antigravity 方式

  "agents": {
    // Director：主导演，Opus 最强推理
    "director": {
      "model": "anthropic/claude-opus-4-6",
      "temperature": 0.4
    },
    // Storyboarder：分镜统筹，Sonnet 足够
    "storyboarder": {
      "model": "anthropic/claude-sonnet-4-6",
      "temperature": 0.3
    },
    // Prompter：提示词工程师，Gemini 大上下文
    "prompter": {
      "model": "google/gemini-2.5-pro",
      "temperature": 0.5
    },
    // ScriptWriter：叙事顾问，Gemini 创意写作
    "script-writer": {
      "model": "google/gemini-2.5-pro",
      "temperature": 0.6,
      // 可追加自定义写作风格
      "prompt_append": "写作风格简洁有力，优先视觉化描述，避免抽象词汇。"
    }
  },

  // 加载影视专业 Skill
  "skills": {
    "cinematography": { "path": "./skills/cinematography/SKILL.md" },
    "video-prompt": { "path": "./skills/video-prompt/SKILL.md" }
  },

  // 禁用不需要的 Hook（影视场景不需要代码相关 Hook）
  "disabled_hooks": ["comment-checker", "lsp-diagnostics"],

  // MCP 配置（保留原有的 websearch，用于参考资料检索）
  "mcp": {
    "websearch": true  // 保留 Exa websearch，Director 可检索参考作品风格
  }
}
```

### 7.5 保留 oh-my-opencode 底层能力清单

以下内容**完全保留，不做任何修改**：

| 能力 | 用途 |
|---|---|
| Background Agents（并行执行） | Prompter 可对多个分镜并行生成提示词 |
| Todo Enforcer Hook | 确保 Director 不跳过验收步骤 |
| Session Recovery | Agent 中途失败自动恢复 |
| MCP websearch（Exa） | Director 检索参考风格、色彩方案 |
| MCP context7 | 检索 AI 视频平台最新 API 文档 |
| Hash-Anchored Edit Tool | 编辑已生成的分镜文档时保障准确性 |
| AGENTS.md 层级注入 | 项目级分镜规范自动注入 |

---

## 八、项目文件结构

```
oh-my-opencinema/
├── src/
│   ├── index.ts                  ← 插件入口（替换 Agent 集合，保留底层）
│   ├── agents/
│   │   ├── director.ts           ← Director Agent 定义
│   │   ├── storyboarder.ts       ← Storyboarder Agent 定义
│   │   ├── prompter.ts           ← Prompter Agent 定义
│   │   └── script-writer.ts      ← ScriptWriter Agent 定义
│   └── tools/
│       └── director_task.ts      ← director_task 工具（替换 sisyphus_task）
│
├── agents/                       ← Agent 系统 Prompt（Markdown 格式）
│   ├── director.md
│   ├── storyboarder.md
│   ├── prompter.md
│   └── script-writer.md
│
├── skills/
│   ├── cinematography/SKILL.md   ← 摄影语言词汇库
│   └── video-prompt/SKILL.md     ← 各平台 Prompt 规范（含原生音频）
│
├── templates/
│   └── storyboard-output.md      ← Markdown 输出模板
│
├── output/                       ← 生成文档存放目录
│
├── .opencode/
│   └── oh-my-opencode.jsonc      ← 项目级配置
│
├── package.json                  ← npm 包配置，name: "oh-my-opencinema"
└── README.md
```

---

## 九、核心命令

```bash
# 安装（用户在 opencode.json 中添加插件）
# { "plugin": ["oh-my-opencinema"] }

# 一键生成分镜文档（核心命令）
ultrashot "制作一个60秒的纪录片风格短片，独自出海的老渔夫"

# 简写
omoc "制作30秒高端香水广告，优雅女性，巴黎街头"

# 指定参数
omoc "产品视频" --platform veo --duration 30s --ratio 16:9 --output product.md

# 分步执行（调试 / 分段生成）
omoc script        # 仅运行 ScriptWriter → 生成叙事文本
omoc shots         # 仅运行 Storyboarder → 生成分镜列表
omoc prompts       # 仅运行 Prompter → 生成提示词文档
omoc review        # Director 验收当前文档
```

---

## 十、通用场景适配示例

Style Spine 根据不同场景自动生成不同方向，无需手动指定：

| 场景类型 | `ultrashot` 示例 | Style Spine 自动方向 | 音频策略 |
|---|---|---|---|
| 商业广告 | "30秒高端香水广告，巴黎街头" | High Key / 暖金冷灰 / Steadicam | 环境音 + 轻柔弦乐配乐 |
| 科幻短片 | "宇航员面对黑洞，60秒" | IMAX感 / 深蓝金橙 / 固定+缓推 | 宇宙静默 + 低频 drone |
| 音乐视频 | "嘻哈MV，城市街头，30秒" | 高对比 / 饱和霓虹 / Handheld甩镜 | 配乐主导，节拍同步 |
| 产品展示 | "智能手表，展示精密工艺，60秒" | 极简白 / 微距 / 固定微调 | 轻微机械声 + 极简ambient |
| 纪录片 | "老渔夫与大海，60秒" | 35mm颗粒 / 自然光 / Handheld | 纯自然音景，无配乐 |
| 教育内容 | "AI发展史，信息图风格，60秒" | 扁平设计 / 高饱和 / 动画感 | 轻快背景音乐 + 旁白 |

---

## 十一、开发路线图

### Phase 1 — MVP
- [ ] 删除原有 Agent（Sisyphus/Hephaestus/Oraboarder/Prompter/ScriptWriter 的 Agent 定义（很关键）
- [ ] 实现 `director_task` 工具（替换 `sisyphus_task`，重定义 Categories）
- [ ] 完成 `cinematography/SKILL.md` + `video-prompt/SKILL.md`（含原生音频格式）
- [ ] 完成 Markdown 输出模板（含 Audio 策略说明）
- [ ] 端到端测试：3 个不同场景的 `ultrashot` 完整流程

### Phase 2 — V0.5
- [ ] 质量评分 + 自动 Retake Loop（Director 验收驱动）
- [ ] Artifact JSON 标准化（含 `audio_elements` 字段）
- [ ] Character Bible 跨镜复用验证机制
- [ ] 多场景 Style Spine 预设（商业/叙事/纪录/MV）

### Phase 3 — V1.0
- [ ] 场景类型自动识别 + Style Spine 智能预设
- [ ] 多平台并行生成（同一镜头输出 Kling/Veo/Sora/Runway 四个版本）
- [ ] npm 包发布（`oh-my-opencinema`）
- [ ] README + 安装指南 + 示例项目

---

> **一句话**：Oh My OpenCinema 是 oh-my-opencode 的影视化改造版，参照 newtype-profile 的 Fork+替换路径，删除原有编程 Agent 集合，用 Director/Storyboarder/Prompter/ScriptWriter 替代，通过 Style Spine 保障跨镜一致性，通过提示词原生嵌入音频描述消除额外音频制作步骤，最终输出一份可直接用于 AI 视频生成的专业分镜提示词 Markdown 文档。
