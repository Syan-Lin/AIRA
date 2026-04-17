<div align="center">

[![License](https://img.shields.io/github/license/Syan-Lin/AIRA.svg)](./LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)

**一个开源的终端 AI 科研助手。**

</div>

## 🎉 简介

AIRA 是一个基于终端的开源 AI 智能体，由 [Qwen Code](https://github.com/QwenLM/qwen-code) 分叉而来，专为**科研 workflow** 设计和优化。它帮助你从论文、笔记和实验数据中构建和管理个人知识库，并用自然语言进行查询和分析。

- **知识库优先**：将论文（PDF）、笔记和数据导入结构化 vault，自动生成摘要（digest）
- **多协议、多模型**：通过 API Key 使用 OpenAI / Anthropic / Gemini / Qwen 等兼容接口
- **科研导向的技能**：内置论文入库（`/ingest`）、知识库问答（`/research`）、健康检查（`/health`）等技能
- **终端原生**：为习惯在命令行工作的研究者打造

## 安装

### 环境要求

确保已安装 **Node.js ≥ 20** 和 **uv**（Python 包管理器）。

- Node.js：[nodejs.org](https://nodejs.org/en/download)
- uv：[docs.astral.sh/uv](https://docs.astral.sh/uv/getting-started/installation/)

### 方式一：本地全局安装（推荐）

```bash
# 克隆仓库
git clone https://github.com/Syan-Lin/AIRA.git
cd AIRA

# 安装依赖并构建
npm install
npm run build
npm run bundle

# 创建全局命令链接
cd packages/cli && npm link

# 现在可以在任意目录使用 aira 命令
aira
```

### 方式二：直接运行（无需全局安装）

```bash
git clone https://github.com/Syan-Lin/AIRA.git
cd AIRA
npm install
npm run build
npm run bundle

# 通过绝对路径运行
aira
```

> **注意**：首次运行时，AIRA 会自动在 `~/.aira/.venv` 创建 Python 虚拟环境，并安装 `aira-ingest` 文档处理工具。

## 快速开始

### 1. 初始化科研项目

```bash
mkdir my-research && cd my-research
aira init
```

这会创建如下结构：

```
my-research/
├── vault/
│   └── index.md          # 知识库索引
└── .gitignore            # 忽略 vault 图片和临时文件
```

### 2. 启动 AIRA

```bash
aira
```

### 3. 配置 API Key

使用 `/auth` 命令，或编辑 `~/.aira/settings.json`：

```json
{
  "modelProviders": {
    "openai": [
      {
        "id": "gpt-4o",
        "name": "GPT-4o",
        "baseUrl": "https://api.openai.com/v1",
        "envKey": "OPENAI_API_KEY"
      }
    ]
  },
  "env": {
    "OPENAI_API_KEY": "sk-xxxxxxxxxxxxx"
  },
  "security": {
    "auth": { "selectedType": "openai" }
  },
  "model": {
    "name": "gpt-4o"
  }
}
```

### 4. 导入论文

切换到**入库模式**（`Ctrl+M` 或 `/change`），然后输入：

```text
把这些论文加入我的知识库：~/Downloads/paper1.pdf ~/Downloads/paper2.pdf
```

或直接通过 shell 工具执行：

```bash
aira-ingest batch paper1.pdf paper2.pdf -v ./vault
```

### 5. 提问分析

切换到**研究模式**（`Ctrl+M` 或 `/change`），然后输入：

```text
基于transformer的海洋-大气耦合模型有哪些关键发现？
```

AIRA 会搜索你的知识库，并基于已导入的论文综合回答。

## 工作模式

AIRA 为科研 workflow 设计了三种专用模式：

| 模式     | 触发方式      | 用途                         |
| -------- | ------------- | ---------------------------- |
| **入库** | `/change` → 1 | 添加论文、笔记和数据到知识库 |
| **研究** | `/change` → 2 | 基于知识库提问和分析         |
| **健康** | `/change` → 3 | 检查断链、孤立文档和质量问题 |

随时使用 `Ctrl+M` 或 `/change` 切换模式。

## 命令

### 会话命令

- `/change` — 切换工作模式（入库 / 研究 / 健康）
- `/skills` — 列出可用的科研技能
- `/help` — 显示可用命令
- `/clear` — 清空对话历史
- `/model` — 切换 AI 模型
- `/exit` 或 `/quit` — 退出 AIRA

### 快捷键

- `Ctrl+M` — 切换工作模式
- `Ctrl+C` — 取消当前操作
- `Ctrl+J` — 输入框换行
- `Ctrl+L` — 清屏
- `Up/Down` — 浏览历史输入
- `Shift+Tab` — 循环审批模式

## 项目结构

```
AIRA/
├── dist/cli.js              # 打包后的 CLI 入口
├── packages/
│   ├── cli/                 # 终端界面和命令
│   ├── core/                # 核心引擎（工具、技能、权限）
│   └── skills/ingest/       # Python 入库 CLI（aira-ingest）
└── docs/                    # 文档
```

## 配置

AIRA 的配置存储在 `~/.aira/settings.json`（全局）和 `.aira/settings.json`（项目级）。

| 文件                    | 作用域       | 说明                          |
| ----------------------- | ------------ | ----------------------------- |
| `~/.aira/settings.json` | 用户（全局） | API Key、模型提供商、默认语言 |
| `.aira/settings.json`   | 项目         | 项目级覆盖配置                |

> **安全提示**：切勿将 API Key 提交到版本控制。`~/.aira/` 目录位于你的主目录下，保持私有。

## 文档

- [AIRA 分叉计划](./AIRA-FORK-PLAN.md) — 详细路线图和架构决策
- [贡献指南](./CONTRIBUTING.md) — 如何为 AIRA 贡献代码

## 常见问题

**`aira-ingest: command not found`**

AIRA 在 `~/.aira/.venv` 管理独立的 Python 虚拟环境，`aira-ingest` 安装在其中并自动注入到 shell 的 PATH。如果遇到此错误，请检查：

1. `uv` 已安装且在系统 PATH 中
2. 运行 `/init` 或重启 AIRA 以触发 venv 初始化

**模型 API 网络问题**

检查 `~/.aira/settings.json` 中的 API Key 配置，并确保 `baseUrl` 在你的网络环境下可访问。

## 致谢

本项目由 [Qwen Code](https://github.com/QwenLM/qwen-code) 分叉而来，而 Qwen Code 又基于 [Google Gemini CLI](https://github.com/google-gemini/gemini-cli)。感谢两个团队的出色工作。

AIRA 在原框架基础上专注于学术研究 workflow，新增了知识库入库、科研导向的技能和模式化 UI。

## 许可证

[Apache-2.0](./LICENSE)
