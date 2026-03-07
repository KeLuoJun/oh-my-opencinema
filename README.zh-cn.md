# Oh My OpenCinema

一个用于AI视频分镜生成的OpenCode插件。将您的视频创意自动转换为详细的分镜脚本，并通过子代理自动编排工作流程。

## 前置要求

本插件需要 [OpenCode](https://github.com/anomalyco/opencode)。请先安装 OpenCode 再使用本插件。

## 概述

Oh My OpenCinema 利用AI帮助您创建专业的视频分镜。只需描述您的视频创意，插件会自动协调一支专业的AI代理团队：

- **Cinema Agent（影院代理）** - 主协调器，接收视频创意并管理整个工作流程
- **Storyboard Agent（分镜代理）** - 设计镜头结构和叙事弧线
- **Prompter Agent（提示词代理）** - 生成AI视频提示词，并提供音频嵌入建议
- **Script Writer Agent（脚本代理）** - 创建叙事文本和对白

## 功能特性

- **自动委托** - Cinema代理自动将任务委托给专业的子代理
- **风格主干生成** - 为您的视频生成一致的视觉风格指南
- **多镜头规划** - 将您的视频分解为详细的镜头，并提供描述
- **提示词工程** - 为AI视频生成工具创建优化的提示词
- **脚本撰写** - 生成叙事文本、字幕和对白

## 安装

在全局或项目本地安装插件：

```bash
npm install oh-my-opencinema
```

或使用 bun：

```bash
bun add oh-my-opencinema
```

## 配置

安装后，在项目的 `opencode.jsonc` 文件中配置插件：

### 代理配置

您可以为每个代理配置特定的 LLM 模型。如果未配置，代理将从父代理（OpenCode 的主代理）继承模型：

```jsonc
{
  // 为每个代理配置模型（可选 - 默认为继承父代理的模型）
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

### 类别配置

您也可以配置任务委托的类别：

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

## 使用方法

1. 在 OpenCode 中启动新会话
2. 使用 `cinema` 代理，描述您的视频创意
3. Cinema代理将自动编排分镜生成

示例：
```
为一个30秒的浪漫短片创建分镜，讲述两个角色在咖啡馆相遇的故事。
```

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

## 许可证

SUL-1.0

## 相关链接

- [OpenCode 官方仓库](https://github.com/anomalyco/opencode)
- [Oh My OpenCinema GitHub](https://github.com/code-yeongyu/oh-my-opencinema)
