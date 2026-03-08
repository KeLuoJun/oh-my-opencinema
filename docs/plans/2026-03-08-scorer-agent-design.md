# Scorer Agent 设计方案

## 背景

当前每个子代理（storyboarder、prompter、script-writer）在各自的系统提示词末尾包含自评分部分。这种方式存在以下问题：
1. 自己给自己打分，缺少独立客观的评估
2. 打分标准不统一
3. 打分维度不够全面

## 目标

创建一个独立的 Scorer Agent，专门负责对子代理的输出进行打分评估。如果分数低于阈值，返回子代理重新优化。

## 核心流程

```
Cinema Agent
    ↓
Storyboarder → 输出 → Scorer 打分 → ≥0.7? → Y→ Prompter
    ↓<重做2次              N↓                        ↓
    ←←←←←←←←←←←←←←← Scorer 打分 → ≥0.7? → Y→ ScriptWriter
                                      N↓                        ↓
                                      ←←←←←←←←←←← Scorer 打分
```

## 打分维度（针对 AI 视频提示词）

| 维度 | 说明 |
|------|------|
| **提示词完整性** | 是否包含四要素（景别 + 动作 + 光效 + 音频） |
| **Style Spine 视觉符合度** | palette_anchors、lighting_logic、camera_grammar 等是否体现在提示词中 |
| **Style Spine 音频符合度** | audio_palette 是否出现在 Audio 段落 |
| **中英文一致性** | 中英文提示词语义是否一致 |
| **情绪弧线完整性** | 叙事弧线是否完整（开篇-发展-高潮-收尾） |
| **连贯性** | 与前序输出的桥接是否合理 |

## 配置结构

```jsonc
{
  "agents": {
    "scorer": {
      "model": "claude-sonnet-4-6",  // 可选，默认使用 OpenCode 当前模型
      "threshold": 0.7,
      "max_retries": 2
    }
  }
}
```

## 文件变更

- 新增 `src/agents/scorer.ts` - Scorer Agent
- 修改 `src/agents/cinema.ts` - 流程中集成打分调用
- 新增/修改配置相关文件

## 验收标准

1. Scorer Agent 能对三个子代理的输出进行独立打分
2. 分数低于 0.7 时自动触发重做流程
3. 重做最多 2 次，超过则跳过或标记失败
4. 支持配置独立的打分模型
