# Oh My OpenCinema

一个用于AI视频分镜生成的OpenCode插件。将您的视频创意自动转换为详细的分镜脚本，并通过子代理自动编排工作流程。

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

```bash
npm install oh-my-opencode
```

或使用bun：

```bash
bun add oh-my-opencode
```

## 使用方法

1. 在OpenCode中安装插件
2. 启动新会话并使用 `cinema` 代理
3. 描述您的视频创意（例如："一个在海滩上的浪漫日落场景"）
4. Cinema代理将自动编排分镜生成

示例提示词：
```
为一个30秒的浪漫短片创建分镜，讲述两个角色在咖啡馆相遇的故事。
```

## 配置

在您的项目中创建 `opencode.jsonc` 文件：

```jsonc
{
  // 启用影院代理
  "agents": {
    "cinema": {
      "enabled": true
    }
  },
  // 可选：配置任务委托的类别
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

## 项目架构

```
src/
├── agents/              # AI代理（cinema、storyboarder、prompter、script-writer）
├── hooks/              # OpenCode生命周期钩子
├── tools/              # 工具，包括用于子代理编排的delegate-task
├── features/           # 独立功能模块
├── config/             # Zod schema配置系统
├── mcp/                # 内置MCP（websearch、context7、grep_app）
└── plugin/             # OpenCode钩子处理器
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

## 作者

YeonGyu-Kim
