# AIRA Fork — 迭代方案

## 目标

将 [AIRA](https://github.com/AI-SOIL-Lab/AIRA) 的核心功能集成到 Qwen Code，作为一个**完全独立的产品**：

- 产品名：`aira`（CLI 命令 `aira`）
- 配置目录：`.aira/`
- 配置文件：`AIRA.md`
- 内置 skill：ingest, research, health, aminer-\*
- 目标用户：学术研究场景（Obsidian + AI 研究助手）

## 技术决策

| 决策        | 选择                             | 理由                            |
| ----------- | -------------------------------- | ------------------------------- |
| Fork 方式   | 当前仓库新建 `aira` 分支         | 可逐步修改，完整 diff 可见      |
| 产品身份    | 完全替换（CLI 名、目录、文件名） | 独立产品，不依附于 Qwen Code    |
| ingest tool | TypeScript 重写                  | 减少 Python/uv 依赖，统一技术栈 |
| Skill 位置  | bundled（内置到代码中）          | 开箱即用，用户无需配置          |
| 命令白名单  | 软禁用                           | 不改代码，只改加载逻辑          |

---

## 迭代架构：Checkpoint 驱动

每个 checkpoint 是一个**可测试的完整状态**。checkpoint 之间：

- 代码可编译
- 基础功能可用（哪怕功能不完整）
- 有明确的测试方法验证

```
CP-0 → CP-1 → CP-2 → CP-3 → CP-4 → CP-5 → CP-6 → CP-7 → CP-8 → CP-9 → CP-10
```

- **CP-0 ~ CP-2**：基础骨架（重命名、裁剪 skill）
- **CP-3 ~ CP-4**：权限 + skill 内容
- **CP-5 ~ CP-6**：ingest tool + init 向导
- **CP-7 ~ CP-8**：交互层 + index 格式升级
- **CP-9 ~ CP-10**：AMiner API + 全局配置

---

## Checkpoint 0：Fork 骨架

**目标**：让 `aira` 命令能跑起来（哪怕是空壳），验证 fork 基础正确。

**改动范围**：

| 文件                                | 改动                                          |
| ----------------------------------- | --------------------------------------------- |
| `package.json`                      | `name`: `@aira/aira-cli`，`bin.aira` 指向入口 |
| `packages/cli/src/config/config.ts` | `.scriptName('aira')`                         |
| Git branch                          | 新建 `aira` 分支                              |

**验证方法**：

```bash
git checkout -b aira
npm run build && npm run bundle
node dist/cli.js --help    # 应显示 "aira" 而非 "qwen"
```

**验收标准**：

- [x] CLI 显示 `aira` 作为命令名
- [x] `npm run build` 通过
- [x] `npm run bundle` 通过
- [x] `aira --help` 正常输出

**实际改动备注**：

- `package.json`：name → `@aira/aira-cli`，version → `0.1.0`，bin 从 `qwen` 改为 `aira`
- `config.ts`：`.scriptName('aira')`，usage 文案改为 "AIRA - AI Research Assistant..."
- 已提交（`51c6cf468`）

---

## Checkpoint 1：身份重命名（核心常量）

**目标**：所有硬编码的 Qwen 身份标识替换为 AIRA。

**改动文件**（按影响范围排序）：

### 1.1 目录/文件名常量

| 文件                                              | 行    | 改前                                    | 改后                                   | 备注             |
| ------------------------------------------------- | ----- | --------------------------------------- | -------------------------------------- | ---------------- |
| `packages/core/src/config/storage.ts`             | 13    | `QWEN_DIR = '.qwen'`                    | `QWEN_DIR = '.aira'`                   | 值改，变量名保留 |
| `packages/core/src/config/storage.ts`             | 16    | `SKILL_PROVIDER_CONFIG_DIRS` 含 `.qwen` | 改为 `.aira`                           |                  |
| `packages/core/src/tools/memoryTool.ts`           | 68-70 | `QWEN_CONFIG_DIR = '.qwen'`             | `QWEN_CONFIG_DIR = '.aira'`            | 值改，变量名保留 |
| `packages/core/src/tools/memoryTool.ts`           | 70    | `DEFAULT_CONTEXT_FILENAME = 'QWEN.md'`  | `DEFAULT_CONTEXT_FILENAME = 'AIRA.md'` |                  |
| `packages/core/src/skills/skill-manager.ts`       | 24    | `QWEN_CONFIG_DIR = '.qwen'`             | `QWEN_CONFIG_DIR = '.aira'`            | 值改，变量名保留 |
| `packages/core/src/subagents/subagent-manager.ts` | 53    | `QWEN_CONFIG_DIR = '.qwen'`             | `QWEN_CONFIG_DIR = '.aira'`            | 值改，变量名保留 |
| `packages/core/src/utils/paths.ts`                | 14    | `QWEN_DIR = '.qwen'`                    | `QWEN_DIR = '.aira'`                   | 值改，变量名保留 |
| `packages/cli/src/config/settings.ts`             | 62    | `SETTINGS_DIRECTORY_NAME = '.qwen'`     | `SETTINGS_DIRECTORY_NAME = '.aira'`    |                  |
| `packages/cli/src/config/trustedFolders.ts`       | 21    | `SETTINGS_DIRECTORY_NAME = '.qwen'`     | `SETTINGS_DIRECTORY_NAME = '.aira'`    |                  |

### 1.2 UI 标识

| 文件                                         | 改前             | 改后           |
| -------------------------------------------- | ---------------- | -------------- |
| `packages/cli/src/ui/components/Header.tsx`  | `'>_ Qwen Code'` | `'>_ AIRA'`    |
| `packages/cli/src/ui/components/AsciiArt.ts` | Qwen ASCII art   | AIRA ASCII art |

### 1.3 系统路径/环境变量

| 文件                                   | 说明                                                       |
| -------------------------------------- | ---------------------------------------------------------- |
| `packages/core/src/config/storage.ts`  | 系统路径含 `QwenCode`/`qwen-code` **保留不变**（最小修改） |
| `packages/core/src/tools/ripGrep.ts`   | `.qwenignore` **保留不变**                                 |
| `packages/core/src/tools/read-file.ts` | `.qwenignore` **保留不变**                                 |

### 1.4 OAuth（保留不动）

OAuth 端点、Client ID、Scope、Grant Type 全部不改。Qwen OAuth 本身就是千问授权，本地使用无影响。

### 1.5 提示/帮助文案

| 文件                                                     | 改前                 | 改后            |
| -------------------------------------------------------- | -------------------- | --------------- |
| `packages/cli/src/config/config.ts`                      | "Qwen Code" 帮助文案 | "AIRA" 文案     |
| `packages/cli/src/services/tips/tipRegistry.ts`          | "Qwen Code" tip 文案 | "AIRA" tip 文案 |
| `packages/core/src/tools/skill.ts`                       | `.qwen/skills/`      | `.aira/skills/` |
| `packages/cli/src/config/settingsSchema.ts`              | "Qwen Code" 设置描述 | "AIRA" 设置描述 |
| `packages/cli/src/commands/extensions/consent.ts`        | "Qwen Code"          | "AIRA"          |
| `packages/cli/src/ui/commands/helpCommand.ts`            | "Qwen Code"          | "AIRA"          |
| `packages/cli/src/ui/commands/docsCommand.ts`            | "Qwen Code"          | "AIRA"          |
| `packages/cli/src/ui/commands/toolsCommand.ts`           | "Qwen Code"          | "AIRA"          |
| `packages/cli/src/ui/commands/hooksCommand.ts`           | "Qwen Code"          | "AIRA"          |
| `packages/cli/src/ui/commands/settingsCommand.ts`        | "Qwen Code"          | "AIRA"          |
| `packages/cli/src/ui/commands/statuslineCommand.ts`      | "Qwen Code"          | "AIRA"          |
| `packages/cli/src/ui/components/hooks/constants.ts`      | "Qwen Code"          | "AIRA"          |
| `packages/cli/src/ui/hooks/useAttentionNotifications.ts` | "Qwen Code"          | "AIRA"          |
| `packages/cli/src/ui/utils/updateCheck.ts`               | "Qwen Code"          | "AIRA"          |
| `packages/cli/src/utils/userStartupWarnings.ts`          | "Qwen Code"          | "AIRA"          |
| `packages/cli/src/utils/systemInfoFields.ts`             | "Qwen Code"          | "AIRA"          |

### 1.6 系统提示

| 文件                                          | 改前                     | 改后                                          |
| --------------------------------------------- | ------------------------ | --------------------------------------------- |
| `packages/core/src/core/prompts.ts`           | `"You are Qwen Code..."` | `"You are AIRA, an AI research assistant..."` |
| `packages/cli/src/ui/commands/initCommand.ts` | `"You are Qwen Code..."` | `"You are AIRA, an AI research assistant..."` |

### 1.7 跳过认证对话框

| 文件                                               | 改动                                                          |
| -------------------------------------------------- | ------------------------------------------------------------- |
| `packages/cli/src/core/initializer.ts`             | `shouldOpenAuthDialog = false`                                |
| `packages/cli/src/ui/auth/useAuth.ts`              | `isAuthDialogOpen` 初始值设为 `false`，`onAuthError` 不再弹窗 |
| `packages/cli/src/ui/components/DialogManager.tsx` | `authError` 不再自动渲染 `AuthDialog`                         |

**验证方法**：

```bash
npm run build && npm run bundle

# 验证目录名
mkdir /tmp/aira-test && cd /tmp/aira-test
node /path/to/aira/dist/cli.js --prompt "hello"    # 应创建 .aira/ 而非 .qwen/

# 验证文件名
ls .aira/    # 应包含 AIRA.md（通过 /init 或 /memory 触发）

# 验证 UI 无弹窗
node /path/to/aira/dist/cli.js    # 直接进入输入框，不弹认证对话框

# 验证 banner
node /path/to/aira/dist/cli.js    # 应显示 AIRA ASCII art 和 >_ AIRA
```

**验收标准**：

- [x] 用户可见的 `.qwen` → `.aira`（配置目录常量，7 个源文件）
- [x] `QWEN.md` → `AIRA.md`
- [x] 用户可见的 `Qwen Code` → `AIRA`（UI 文案、tips、help、commands）
- [~] `QWEN_` 环境变量 → `AIRA_`（**保留不变**，最小修改原则）
- [x] 系统提示改为 AIRA 身份
- [x] 认证对话框默认跳过（API Key 预配置场景）
- [x] `npm run build` 通过
- [x] `npm run lint` 通过

**实际改动备注**：

- 遵循**最小修改原则**：只改用户可见的业务标识，不改内部代码变量名（`QWEN_DIR`、`QWEN_CONFIG_DIR` 等保留）
- 不改测试文件、不改 OAuth/Channel/IDE 插件相关代码
- 已提交：`70c961eb3`（身份重命名）+ `bc610712c`（跳过 AuthDialog + ASCII logo）+ `73b58a2d5`（修复首次启动弹窗）

---

## Checkpoint 2：裁剪 Skill + 白名单

**目标**：移除不相关的内置 skill，只保留 AIRA 需要的。

### 2.1 删除不相关的 bundled skill

```
删除：packages/core/src/skills/bundled/review/
删除：packages/core/src/skills/bundled/qc-helper/
删除：packages/core/src/skills/bundled/loop/
```

### 2.2 新增 AIRA bundled skill 骨架

```
创建：packages/core/src/skills/bundled/ingest/SKILL.md    （占位，CP-4 填充内容）
创建：packages/core/src/skills/bundled/research/SKILL.md  （占位）
创建：packages/core/src/skills/bundled/health/SKILL.md    （占位）
创建：packages/core/src/skills/bundled/aminer-free-search/SKILL.md  （占位）
创建：packages/core/src/skills/bundled/aminer-data-search/SKILL.md  （占位）
创建：packages/core/src/skills/bundled/aminer-daily-paper/SKILL.md  （占位）
```

每个 SKILL.md 初始内容：

```yaml
---
name: ingest
description: Unified knowledge base ingestion skill.
---
# Ingest Skill

WIP — full content will be added in CP-4.
```

### 2.3 软禁用机制

**不改核心 skill 加载代码**，通过以下方式实现软禁用：

1. **删除** 不需要的 bundled skill 目录（skill manager 自然找不到它们）
2. **不加载** extension skill（AIRA 模式不需要 extension 机制）
3. 用户级 `.aira/skills/` 和项目级 `{cwd}/.aira/skills/` 仍可扩展

**需要修改的文件**：

| 文件                                 | 改动                                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------------ |
| `packages/core/src/config/config.ts` | `createToolRegistry()` 中移除或条件注册非 AIRA tool（如 `CronTool`, `ArenaTool` 等） |
| `packages/core/src/tools/skill.ts`   | 更新无 skill 时的提示文案（`.aira/skills/`）                                         |

### 2.4 裁剪非 AIRA tool

在 `createToolRegistry()` 中，通过条件判断（如 `this.channel === 'AIRA'` 或新增 `isAirMode` 标志）跳过注册：

- `CronCreate/List/Delete` — AIRA 不需要
- Arena 相关 tool — AIRA 不需要
- 其他非核心 tool 按需裁剪

**保留的核心 tool**（全部保留）：

- `AgentTool`（subagent）
- `SkillTool`
- `ReadFileTool`
- `GrepTool` / `RipGrepTool`
- `GlobTool`
- `EditTool`
- `WriteFileTool`
- `ShellTool`
- `MemoryTool`
- `TodoWriteTool`
- `AskUserQuestionTool`
- `WebFetchTool`
- `WebSearchTool`

**验证方法**：

```bash
npm run build && npm run bundle

# 验证 skill 列表
aira --prompt "列出可用 skill"    # 应只显示 ingest, research, health, aminer-*

# 验证 tool 可用性
aira --prompt "创建一个 cron 任务"    # 应显示 cron 不可用
```

**验收标准**：

- [x] 非 AIRA bundled skill 已删除
- [x] AIRA skill 骨架已创建
- [x] skill 列表只显示 AIRA skill
- [x] 核心 tool 仍可用
- [x] 非 AIRA tool 不可用（或返回"不支持"）
- [x] `npm run build` 通过

**实际改动备注**：

- 删除 bundled skills：`review/`、`qc-helper/`、`loop/`
- 新建 6 个 AIRA skill 骨架：`ingest`、`research`、`health`、`aminer-free-search`、`aminer-data-search`、`aminer-daily-paper`
- `packages/core/src/config/config.ts`：移除 `CronCreateTool`/`CronListTool`/`CronDeleteTool` 的 import 和注册
- `scripts/copy_bundle_assets.js`、`prepare-package.js`、`dev.js`：清理 qc-helper 文档复制/检查逻辑
- `packages/core/src/skills/skill-manager.test.ts`：将测试中硬编码的 `.qwen/skills` 路径同步更新为 `.aira/skills`
- 未改动 `channel`，未新增 `isAirMode` 标志；直接以 fork 后的固定产品形态裁剪功能

---

## Checkpoint 3：Approval Mode 白名单

**目标**：默认 auto-approval，但仅限 ingest + 学术搜索。

### 3.1 默认 approval mode

| 文件                                 | 改动                                                         |
| ------------------------------------ | ------------------------------------------------------------ |
| `packages/cli/src/config/config.ts`  | `loadCliConfig()` 中，AIRA 模式默认 `ApprovalMode.AUTO_EDIT` |
| `packages/core/src/config/config.ts` | 构造函数默认值改为 `ApprovalMode.AUTO_EDIT`（仅 AIRA）       |

### 3.2 白名单机制

利用现有 `PermissionManager` 的规则系统：

在 `createToolRegistry()` 之后，注入白名单规则：

```typescript
// 伪代码：仅 AIRA 模式
if (this.isAirMode) {
  this.permissionManager.addRules({
    allow: [
      'ingest',
      'aminer-free-search',
      'aminer-data-search',
      'aminer-daily-paper',
    ],
    // 其他工具默认 ask（需用户确认）
  });
}
```

实际实现通过 `settings.tools.permissions` 的 `allow` 规则注入。

**需要修改的文件**：

| 文件                                                  | 改动                                       |
| ----------------------------------------------------- | ------------------------------------------ |
| `packages/cli/src/config/config.ts`                   | `loadCliConfig()` 中注入白名单规则         |
| `packages/core/src/permissions/permission-manager.ts` | 确认 `allow` 规则支持 skill 级别（需验证） |

**验证方法**：

```bash
npm run build && npm run bundle

# 验证 ingest 自动执行
aira --prompt "把这篇论文加进来 paper.pdf"    # 应自动执行，不需确认

# 验证非白名单 tool 需确认
aira --prompt "删除文件 foo.txt"    # 应要求用户确认
```

**验收标准**：

- [ ] 默认 approval mode 为 `auto-edit`
- [ ] ingest skill 操作自动执行
- [ ] 学术搜索 skill 自动执行
- [ ] 非白名单工具需用户确认
- [ ] `npm run build` 通过

---

## Checkpoint 4：移植 AIRA Skill 内容

**目标**：将 AIRA 的 skill 内容完整移植到 bundled skill 中。

### 4.1 从 AIRA 项目移植

| 源文件                                    | 目标文件                                                       |
| ----------------------------------------- | -------------------------------------------------------------- |
| `AIRA/skills/ingest/SKILL.md`             | `packages/core/src/skills/bundled/ingest/SKILL.md`             |
| `AIRA/skills/research/SKILL.md`           | `packages/core/src/skills/bundled/research/SKILL.md`           |
| `AIRA/skills/health/SKILL.md`             | `packages/core/src/skills/bundled/health/SKILL.md`             |
| `AIRA/skills/aminer-free-search/SKILL.md` | `packages/core/src/skills/bundled/aminer-free-search/SKILL.md` |
| `AIRA/skills/aminer-data-search/SKILL.md` | `packages/core/src/skills/bundled/aminer-data-search/SKILL.md` |
| `AIRA/skills/aminer-daily-paper/SKILL.md` | `packages/core/src/skills/bundled/aminer-daily-paper/SKILL.md` |

### 4.2 适配 bundled skill 格式

Qwen Code 的 bundled skill 格式与 AIRA SKILL.md 基本一致（YAML frontmatter + markdown body），需要适配的点：

- **`allowedTools`**：如果 skill 需要特定 tool，在 frontmatter 中声明
- **路径引用**：skill 内容中引用 `.qwen/` 的地方改为 `.aira/`
- **CLI tool 调用**：`aira-ingest` 原本是 Python CLI，CP-5 用 TS 重写

### 4.3 重写 skill 内容中的路径

全文搜索替换：

- `.qwen/` → `.aira/`
- `vault/` → `vault/`（保持不变）
- `QWEN.md` → `AIRA.md`

**验证方法**：

```bash
npm run build && npm run bundle

# 验证 skill 可加载
aira --prompt "使用 ingest skill 处理 paper.pdf"    # skill 应正确加载并执行

# 验证 skill 内容正确
aira --prompt "使用 research skill 回答：钛合金疲劳寿命预测有哪些方法？"
```

**验收标准**：

- [ ] 所有 6 个 skill 内容已移植
- [ ] Skill 中的路径引用已适配 `.aira/`
- [ ] Skill 可正常加载和执行
- [ ] `npm run build` 通过
- [ ] `npm run lint` 通过

---

## Checkpoint 5：TypeScript 重写 ingest tool

**目标**：用 TypeScript 重写 `aira-ingest` CLI tool，作为 AIRA 内置 tool。

### 5.1 设计新的 tool

在 Qwen Code 的 tool 系统中新增 `AiraIngestTool`：

```typescript
// packages/core/src/tools/aira-ingest.ts
export class AiraIngestTool extends BaseTool<...> {
  static readonly Name = 'aira_ingest';

  // 支持的输入类型：PDF, DOCX, PPTX, URL, MD, TXT
  // 文件转换：调用外部 MinerU CLI（或通过 API）
  // 写入 raw/ 目录
}
```

### 5.2 Tool 注册

| 文件                                     | 改动                                           |
| ---------------------------------------- | ---------------------------------------------- |
| `packages/core/src/config/config.ts`     | `createToolRegistry()` 中注册 `AiraIngestTool` |
| `packages/core/src/tools/aira-ingest.ts` | 新建 tool 实现                                 |

### 5.3 文件转换策略

| 输入类型  | 转换方式                               |
| --------- | -------------------------------------- |
| PDF       | 调用 `mineru` CLI（外部依赖，需安装）  |
| DOCX/PPTX | 调用 `mineru` CLI                      |
| URL       | 调用 `mineru crawl` CLI 或 `firecrawl` |
| MD/TXT    | 直接读取复制                           |

MinerU CLI 作为**可选外部依赖**，tool 启动时检查是否可用，不可用时降级为纯文本提取。

### 5.4 ingest skill 适配

修改 `bundled/ingest/SKILL.md` 中调用 CLI tool 的部分：

```bash
# 改前（Python CLI）
aira-ingest ingest paper.pdf -v vault/

# 改后（内置 tool）
# AI 调用 `aira_ingest` tool，传入文件路径和 vault 目录
```

**验证方法**：

```bash
npm run build && npm run bundle

# 验证 tool 可运行
aira --prompt "把 paper.pdf 加进来"    # 应自动转换 PDF，写入 raw/，生成 digest，更新 index

# 验证多文件
aira --prompt "处理新文件"    # 应通过 git diff 发现 raw/ 中的新文件
```

**验收标准**：

- [ ] `AiraIngestTool` 已实现
- [ ] 支持 PDF/DOCX/PPTX/URL/MD/TXT 输入
- [ ] MinerU CLI 作为可选外部依赖
- [ ] ingest skill 已适配新 tool
- [ ] ingest 流程端到端可用
- [ ] `npm run build` 通过

---

## Checkpoint 6：AIRA 初始化向导

**目标**：新增 `aira init` 子命令，交互式创建 AIRA 项目。

### 6.1 子命令实现

| 文件                                | 改动                                |
| ----------------------------------- | ----------------------------------- |
| `packages/cli/src/config/config.ts` | 新增 `.command('init', ...)` 子命令 |
| `packages/cli/src/commands/init.ts` | 新建 init 命令实现                  |

### 6.2 init 流程

```
aira init
  ↓
1. 询问知识库名称（可选，默认使用当前目录名）
2. 创建目录结构：
   vault/
   ├── index.md          （带模板 header）
   ├── raw/
   └── digest/
3. 创建 .gitignore：
   .venv/
   node_modules/
   *.tmp
4. 创建 AIRA.md 项目配置（可选）
5. 引导配置 API key：
   - MinerU Token
   - AMiner Token
6. 引导安装依赖：
   - MinerU CLI
7. Git init + commit（如果尚未初始化）
```

### 6.3 index.md 模板

```markdown
# Index

## Papers

<!-- 论文条目 -->

## Ideas

<!-- 想法条目 -->

## Experiments

<!-- 实验条目 -->

## Discussions

<!-- 讨论条目 -->

> 格式：[[xxx_digest|显示名]] `#tag1` `#tag2` c:{confidence} — {一句话总结}
```

**验证方法**：

```bash
npm run build && npm run bundle

mkdir /tmp/test-aira && cd /tmp/test-aira
aira init

# 验证目录结构
ls -la vault/
cat vault/index.md
cat .gitignore

# 验证 git 初始化
git log --oneline    # 应有初始 commit
```

**验收标准**：

- [ ] `aira init` 子命令可用
- [ ] 交互式引导流程完整
- [ ] 目录结构正确创建
- [ ] .gitignore 正确
- [ ] index.md 模板正确（含一句话总结格式说明）
- [ ] Git init + commit 正常执行
- [ ] `npm run build` 通过

---

## Checkpoint 7：AIRA 交互层

**目标**：将交互设计融入 Qwen Code CLI——模式选择对话框、`/change` 命令、Footer 状态栏、Composer 模式提示。

### 7.1 新增文件

| 文件                                                   | 说明                                    |
| ------------------------------------------------------ | --------------------------------------- |
| `packages/cli/src/ui/components/AiraModeDialog.tsx`    | 模式选择对话框，通过 DialogManager 管理 |
| `packages/cli/src/ui/commands/airaChangeCommand.ts`    | `/change` 命令实现，打开模式选择对话框  |
| `packages/cli/src/ui/components/AiraStatusLine.tsx`    | Footer 左侧状态栏组件（显示当前模式）   |
| `packages/cli/src/ui/contexts/AiraModeContext.tsx`     | AIRA 模式状态管理（mode、dialog 开关）  |
| `packages/cli/src/ui/components/AiraStartupPrompt.tsx` | 启动时的模式选择提示卡片                |

### 7.2 修改文件

| 文件                                               | 改动                               |
| -------------------------------------------------- | ---------------------------------- |
| `packages/cli/src/ui/components/Footer.tsx`        | 新增 AIRA 模式状态显示区域（左侧） |
| `packages/cli/src/ui/components/Composer.tsx`      | 模式特定 placeholder 支持          |
| `packages/cli/src/ui/components/DialogManager.tsx` | 新增 `isAiraModeDialogOpen` 状态   |
| `packages/cli/src/ui/components/Header.tsx`        | AIRA ASCII art + 启动提示卡片逻辑  |
| `packages/cli/src/ui/commands/index.ts`            | 注册 `/change` 命令                |
| `packages/cli/src/config/keyBindings.ts`           | 新增 `Ctrl+M` 快捷键绑定           |

### 7.3 UIState 新增状态

```typescript
interface UIState {
  // ... 现有状态

  // AIRA 模式状态
  airaMode: 'ingest' | 'research' | 'health' | 'unselected';
  isAiraModeDialogOpen: boolean;
}
```

### 7.4 `/change` 命令行为

```
/change

🔄 切换工作模式

当前模式：📥 添加内容

  [1] 📥 添加内容    — 论文、想法、实验数据入库
  [2] 🔍 提问分析    — 基于知识库回答问题
  [3] 💚 健康检查    — 检查链接、断链、孤立文档

选择 [1-3] 或输入模式名称：

⚠️  切换模式将清空当前对话上下文
   确认切换？ [Y/n]
```

**切换后行为：**

- 清空对话历史（复用 `/clear` 逻辑）
- 更新 Footer 状态栏显示当前模式
- 更新 Composer 提示语（模式特定 placeholder）

### 7.5 模式特定 Composer Placeholder

| 模式        | Placeholder                                    |
| ----------- | ---------------------------------------------- |
| 📥 Ingest   | "输入 URL、文件路径或粘贴内容（最多 5 条）..." |
| 🔍 Research | "输入你的问题，基于知识库回答..."              |
| 💚 Health   | "按 Y 开始检查，或输入特定检查项..."           |

### 7.6 快捷键

| 快捷键   | 行为                  | 说明   |
| -------- | --------------------- | ------ |
| `Ctrl+M` | 打开 `/change` 对话框 | 可配置 |

**验证方法**：

```bash
npm run build && npm run bundle

# 验证启动提示
aira    # 应显示模式选择卡片

# 验证 /change 命令
/change    # 应打开模式选择对话框

# 验证快捷键
Ctrl+M    # 应打开模式选择对话框

# 验证 Footer 状态栏
选择模式后    # Footer 左侧应显示当前模式

# 验证 Composer placeholder
选择模式后    # 输入框 placeholder 应随模式变化

# 验证切换清空
切换到新模后    # 对话历史应清空
```

**验收标准**：

- [ ] 启动时显示模式选择提示卡片
- [ ] `/change` 命令可打开模式选择对话框
- [ ] `Ctrl+M` 快捷键可打开模式选择对话框
- [ ] 选择模式后 Footer 显示当前模式
- [ ] 选择模式后 Composer placeholder 随模式变化
- [ ] 切换模式时清空对话历史并有确认提示
- [ ] `npm run build` 通过
- [ ] `npm run lint` 通过

---

## Checkpoint 8：Index.md 格式升级

**目标**：ingest skill 写入 index.md 时追加一句话摘要。

### 8.1 格式变更

```markdown
# 改前

- [[paper_001_digest|Deep Learning for Fatigue Life Prediction]] `#Ti-alloy` `#fatigue` `#CNN` c:4

# 改后

- [[paper_001_digest|Deep Learning for Fatigue Life Prediction]] `#Ti-alloy` `#fatigue` `#CNN` c:4 — 提出CNN模型预测钛合金疲劳寿命
```

### 8.2 改动点

| 文件                                                 | 改动                                              |
| ---------------------------------------------------- | ------------------------------------------------- |
| `packages/core/src/skills/bundled/ingest/SKILL.md`   | Step 5（更新 index.md）中增加"生成一句话摘要"步骤 |
| `packages/core/src/skills/bundled/research/SKILL.md` | 引用格式适配新 index 格式                         |

**一句话摘要规则**：

- 15-20 字以内
- 概括文档核心价值
- 不使用完整句子（用短语）

### 8.3 health skill 适配

health skill 需要检查 index.md 格式是否正确：

- 每行是否有一句话摘要
- 缺失摘要的条目标记为"需修复"

**验证方法**：

```bash
npm run build && npm run bundle

aira --prompt "把 paper.pdf 加进来"
cat vault/index.md    # 新条目应有一句话摘要

aira --prompt "检查健康度"    # health skill 应检查摘要完整性
```

**验收标准**：

- [ ] ingest 写入 index.md 时追加一句话摘要
- [ ] 摘要长度 15-20 字以内
- [ ] health skill 检查摘要完整性
- [ ] 已有条目无摘要的不强制补全（渐进式迁移）

---

## Checkpoint 9：AMiner Skill API 对接

**目标**：让 aminer 系列 skill 真实调用 AMiner API，返回学术搜索结果。

### 9.1 AMiner API 调研

AMiner（https://www.aminer.cn/）提供的学术搜索接口：

| 接口                 | 功能     | 是否需要 Token |
| -------------------- | -------- | -------------- |
| `/api/search/author` | 作者搜索 | 免费           |
| `/api/search/paper`  | 论文搜索 | 免费           |
| `/api/search/trend`  | 研究趋势 | 免费           |
| 全量接口             | 完整数据 | 需要 API Token |

### 9.2 新增 Tool：AminerSearchTool

在 Qwen Code tool 系统中新增 `aminer_search` tool：

```typescript
// packages/core/src/tools/aminer-search.ts
export class AminerSearchTool extends BaseTool<...> {
  static readonly Name = 'aminer_search';

  // 输入：query, type（author/paper/trend）, page, size
  // 输出：JSON 格式搜索结果
  // API Token 从 process.env.AMINER_TOKEN 读取，可选（免费接口无需 token）
}
```

### 9.3 Tool 注册

| 文件                                       | 改动                                             |
| ------------------------------------------ | ------------------------------------------------ |
| `packages/core/src/config/config.ts`       | `createToolRegistry()` 中注册 `AminerSearchTool` |
| `packages/core/src/tools/aminer-search.ts` | 新建 tool 实现                                   |

### 9.4 Skill 适配

修改 3 个 aminer skill 的 SKILL.md，将调用方式改为使用 `aminer_search` tool：

| Skill                | 改动                                                      |
| -------------------- | --------------------------------------------------------- |
| `aminer-free-search` | 使用 `aminer_search` tool，type 参数指定搜索类型          |
| `aminer-data-search` | 使用 `aminer_search` tool + 全量接口（需 `AMINER_TOKEN`） |
| `aminer-daily-paper` | 使用 `aminer_search` tool 获取最新论文                    |

### 9.5 API Token 管理

| 方式                    | 说明                  |
| ----------------------- | --------------------- |
| 环境变量 `AMINER_TOKEN` | 用户自行设置          |
| `aira init` 引导配置    | CP-6 中已包含引导步骤 |

免费接口无需 token，全量接口需要 token。tool 启动时检测 `AMINER_TOKEN`，不存在时降级为免费模式。

### 9.6 错误处理

| 错误                   | 处理                                 |
| ---------------------- | ------------------------------------ |
| 网络超时               | 提示用户重试                         |
| API 限流               | 报告限流信息，引导用户等待           |
| Token 无效（全量接口） | 提示用户检查 `AMINER_TOKEN`          |
| 无结果                 | 返回"未找到相关论文"，引导调整关键词 |

**验证方法**：

```bash
npm run build && npm run bundle

# 验证免费搜索
aira --prompt "搜索钛合金疲劳寿命预测相关论文"    # 应返回搜索结果

# 验证全量搜索（设置 token 后）
export AMINER_TOKEN=xxx
aira --prompt "获取钛合金研究趋势数据"    # 应返回完整数据
```

**验收标准**：

- [ ] `AminerSearchTool` 已实现
- [ ] 免费搜索接口可用（无需 token）
- [ ] 全量搜索接口可用（需 `AMINER_TOKEN`）
- [ ] 3 个 aminer skill 已适配新 tool
- [ ] 错误处理正确
- [ ] `npm run build` 通过

---

## Checkpoint 10：全局配置管理

**目标**：引入 `~/.aira/config.json` 作为全局配置，存储 API key 等敏感信息。

### 10.1 配置文件结构

```jsonc
// ~/.aira/config.json
{
  "aminer": {
    "token": "xxx", // AMiner API Token
  },
  "mineru": {
    "token": "xxx", // MinerU Token（如果通过 API 调用）
  },
  "preferences": {
    "defaultMode": "research", // 默认模式：ingest | research | health
    "language": "zh-CN", // 输出语言
  },
}
```

### 10.2 配置加载

利用 Qwen Code 现有的配置加载机制：

| 文件                                  | 改动                                                      |
| ------------------------------------- | --------------------------------------------------------- |
| `packages/cli/src/config/settings.ts` | 新增 `AIRA_GLOBAL_CONFIG_PATH` 指向 `~/.aira/config.json` |
| `packages/core/src/config/storage.ts` | 新增 `loadAiraGlobalConfig()` 方法                        |

加载顺序（优先级从低到高）：

1. 内置默认值
2. `~/.aira/config.json`（全局）
3. `{cwd}/.aira/config.json`（项目级，如果存在）
4. 环境变量（最高优先级）

### 10.3 `aira config` 子命令

```bash
aira config                    # 查看当前配置
aira config set aminer.token xxx    # 设置配置项
aira config get aminer.token        # 获取配置项
aira config list                     # 列出所有配置（隐藏敏感值）
```

| 文件                                  | 改动                             |
| ------------------------------------- | -------------------------------- |
| `packages/cli/src/config/config.ts`   | 新增 `.command('config')` 子命令 |
| `packages/cli/src/commands/config.ts` | 新建 config 命令实现             |

### 10.4 Skill/Tool 读取配置

AMiner tool 和 MinerU tool 从全局配置中读取 token，而不是从环境变量：

```typescript
// 伪代码
const config = loadAiraGlobalConfig();
const token = config?.aminer?.token ?? process.env.AMINER_TOKEN;
```

### 10.5 `aira init` 集成

CP-6 的 `aira init` 向导中，引导配置的步骤改为：

1. 检查 `~/.aira/config.json` 是否存在
2. 如果不存在，引导创建
3. 引导输入 `AMINER_TOKEN`（可选）
4. 引导输入 `MINERU_TOKEN`（可选）

**验证方法**：

```bash
npm run build && npm run bundle

# 验证配置文件创建
aira config set aminer.token xxx
cat ~/.aira/config.json    # 应包含 token

# 验证 config 子命令
aira config list    # 应列出配置项（token 隐藏）
aira config get aminer.token    # 应显示 token 值

# 验证 skill 读取配置
aira --prompt "搜索钛合金论文"    # aminer tool 应从配置文件读取 token
```

**验收标准**：

- [ ] `~/.aira/config.json` 可创建和编辑
- [ ] `aira config` 子命令可用
- [ ] `set/get/list` 命令正常工作
- [ ] AMiner tool 从配置文件读取 token
- [ ] 环境变量优先级高于配置文件
- [ ] 敏感值在 `list` 中隐藏显示
- [ ] `npm run build` 通过

---

## 后续迭代（超出本次范围）

无。当前所有已规划 checkpoint 覆盖 AIRA MVP 所需全部功能。

| Checkpoint  | 状态            |
| ----------- | --------------- |
| CP-0 ~ CP-8 | 核心功能        |
| CP-9        | AMiner API 对接 |
| CP-10       | 全局配置管理    |

## 交互设计

### 架构原则

AIRA 的交互**完全复用 Qwen Code CLI 现有架构**，不新建独立 UI：

- **DialogManager** — 模式选择、确认对话框
- **Slash Commands** — `/change` 切换模式、`/help`、`/clear`
- **Footer 状态栏** — 显示当前模式、上下文使用
- **Composer** — 输入区域，模式特定提示
- **Header** — AIRA ASCII art + 版本信息

### 启动界面

```
[Header: AIRA ASCII art + version + model]

────────────────────────────────────────
🎓 AIRA 研究助手

  选择工作模式开始使用：

  [1] 📥 添加内容    — 论文、想法、实验数据入库
  [2] 🔍 提问分析    — 基于知识库回答问题
  [3] 💚 健康检查    — 检查链接、断链、孤立文档

  或直接输入你的问题，我会自动识别模式

  /change 切换模式  |  /help 查看所有命令
────────────────────────────────────────
```

启动时显示模式选择（作为初始提示卡片），用户选择后进入对应模式。也可以直接输入，系统自动识别意图。

### 模式切换（`/change` 命令 + 快捷键）

**命令：** `/change` 或 `Ctrl+M`（可配置）

通过 DialogManager 打开 `AiraModeDialog`：

```
🔄 切换工作模式

当前模式：📥 添加内容

  [1] 📥 添加内容    — 论文、想法、实验数据入库
  [2] 🔍 提问分析    — 基于知识库回答问题
  [3] 💚 健康检查    — 检查链接、断链、孤立文档

选择 [1-3] 或输入模式名称：

⚠️  切换模式将清空当前对话上下文
   确认切换？ [Y/n]
```

**切换后行为：**

- 清空对话历史（复用 `/clear` 逻辑）
- 更新 Footer 状态栏显示当前模式
- 更新 Composer 提示语（模式特定的 placeholder）

### 模式状态展示（Footer 状态栏）

```
[Footer 左侧]
📥 Ingest 模式

[Footer 中间]
Context: ▓▓▓░░░ 45%

[Footer 右侧]
/change 切换模式  |  Esc 清空输入
```

### 模式特定 Composer 提示

| 模式        | Composer Placeholder                           |
| ----------- | ---------------------------------------------- |
| 📥 Ingest   | "输入 URL、文件路径或粘贴内容（最多 5 条）..." |
| 🔍 Research | "输入你的问题，基于知识库回答..."              |
| 💚 Health   | "按 Y 开始检查，或输入特定检查项..."           |

---

### Ingest 交互

```
📥 添加内容模式

当前：正在添加内容到知识库
支持：论文 URL / PDF 路径 / 直接粘贴文本（最多 5 条）

输入（或粘贴内容）：
>
```

**输入源：**

- URL（arXiv、PubMed、任意论文链接）
- 本地文件路径（PDF、DOCX、PPTX、MD、TXT）
- 直接粘贴文本（想法笔记、摘要、实验数据）
- 最多一次 5 条，超过则提示"请分批添加"

**执行流程（全自动，不确认）：**

1. 识别输入类型（URL / 文件路径 / 纯文本）
2. 抓取/读取内容
3. 解析 → 写入 `vault/raw/`
4. 生成摘要 → 写入 `vault/digest/`
5. 更新 `vault/index.md`
6. Git commit

**成功反馈：**

```
✅ 已入库

  标题：XXX: A Novel Approach to YYY
  标签：#machine-learning #method
  位置：vault/raw/2026-04-14-xxx-novel-approach.md

  下一步：
    - 继续添加内容
    - 提问分析（切换到 Research 模式）
```

**错误处理（报告问题 + 引导重试）：**

```
❌ 无法解析该文件

  原因：PDF 文件损坏或加密
  建议：
    - 换一个 PDF 试试
    - 粘贴论文文本内容
    - 提供论文 URL 让我来抓取

输入：_
```

### Research 交互

```
🔍 提问分析模式

当前：基于知识库回答问题
支持：论文对比、方法分析、实验设计建议

输入你的问题：
>
```

**结果展示（分层展示）：**

第一层 — 结论摘要：

- 简明回答核心结论
- 标注有多少篇论文支撑

第二层 — 详细分析（用户展开后显示）：

- 分点论述，每点标注支持的论文 `[[wikilink]]`
- 对比、矛盾、趋势分析

第三层 — 引用来源表格：

```
| # | 论文 | 置信度 | 关键发现 |
|---|------|--------|---------|
| 1 | [[paper_001_digest|...]] | c:4 | CNN 模型精度 92% |
```

**多轮对话（保持上下文）：**

- 记住上一轮问题和引用的论文
- 追问时基于同一批引用深入
- 显示"上下文：已引用 N 篇论文"
- 用户输入"重新开始"清空上下文

**无结果处理（用通用知识回答）：**

```
知识库中暂无直接相关内容。

基于通用知识，钛合金疲劳寿命预测的主要方法包括：
...

（以上回答未引用知识库中的论文）
```

**退出方式：**

- 输入 `/` 返回启动界面

---

### Health 交互

```
💚 健康检查模式

当前：检查知识库完整性
执行：链接检查 / 孤立文档 / index 同步 / 质量检查

开始检查？ [Y/n]
```

**检查结果（全自动修复）：**

```
💚 健康检查完成

健康度：85% (良好)

已自动修复：
  ✅ 修复 3 个断链（更新指向 digest）
  ✅ 同步 2 个 index 条目（新增 missing digest 引用）
  ✅ 清理 1 个空文件

需要你处理：
  ⚠️  paper_008.md 内容缺失（raw 有文件但 digest 为空）
      建议：重新运行 ingest 或手动补充摘要

输入 / 返回启动界面：
>
```

**检查项目：**

| 项目       | 说明                               | 自动修复       |
| ---------- | ---------------------------------- | -------------- |
| 断链       | `[[wikilink]]` 指向不存在的文件    | 更新指向或移除 |
| 孤立文档   | raw/digest 中未被 index 引用的文件 | 加入 index     |
| Index 同步 | index 引用的文件不存在             | 移除条目或标记 |
| 空文件     | raw/digest 为空的文件              | 报告，用户处理 |
| 矛盾检测   | 同一主题多条矛盾结论               | 标记，用户判断 |

**触发方式：** 手动触发（用户主动选择 Health 模式）

---

### 实现细节（融入 Qwen Code CLI）

**新增文件：**

| 文件                                                  | 说明                                    |
| ----------------------------------------------------- | --------------------------------------- |
| `packages/cli/src/ui/components/AiraModeDialog.tsx`   | 模式选择对话框，通过 DialogManager 管理 |
| `packages/cli/src/ui/commands/airaChangeCommand.ts`   | `/change` 命令实现                      |
| `packages/cli/src/ui/components/AiraFooterStatus.tsx` | Footer 状态栏组件（显示当前模式）       |
| `packages/cli/src/ui/contexts/AiraModeContext.tsx`    | AIRA 模式状态管理                       |

**修改文件：**

| 文件                                               | 改动                             |
| -------------------------------------------------- | -------------------------------- |
| `packages/cli/src/ui/components/Footer.tsx`        | 新增 AIRA 模式状态显示区域       |
| `packages/cli/src/ui/components/Composer.tsx`      | 模式特定 placeholder 支持        |
| `packages/cli/src/ui/components/DialogManager.tsx` | 新增 `isAiraModeDialogOpen` 状态 |
| `packages/cli/src/ui/components/Header.tsx`        | AIRA ASCII art + 初始提示卡片    |
| `packages/cli/src/ui/commands/index.ts`            | 注册 `/change` 命令              |

**UIState 新增状态：**

```typescript
interface UIState {
  // ... 现有状态

  // AIRA 模式状态
  airaMode: 'ingest' | 'research' | 'health' | 'unselected';
  isAiraModeDialogOpen: boolean;
}
```

**键盘快捷键：**

| 快捷键   | 行为                  | 说明         |
| -------- | --------------------- | ------------ |
| `Ctrl+M` | 打开 `/change` 对话框 | 可配置       |
| `Esc`    | 清空输入              | 复用现有行为 |

---

## 总体验证

所有 checkpoint 完成后，端到端测试流程：

```bash
# 1. 初始化
mkdir ~/research && cd ~/research
aira init

# 2. 添加论文
aira
> 把 paper.pdf 加进来
（自动：PDF 转换 → raw/ → digest/ → index.md → git commit）

# 3. 添加 URL
> 抓取 https://arxiv.org/abs/2401.xxxxx 这篇论文
（自动：URL 抓取 → 同上流程）

# 4. 问答
> 基于我的知识库，钛合金疲劳寿命预测有哪些主流方法？
（自动：三层筛选 → index → digest → raw → 回答 + 引用）

# 5. 健康检查
> 检查知识库健康度
（自动：链接完整性、孤立文档、index 同步、矛盾检测）

# 6. 添加想法
> 我有个想法：用 GAN 反向设计热处理工艺
（自动：生成 digest → index → git commit）

# 7. AMiner 搜索（CP-9）
> 搜索钛合金疲劳的最新论文
（自动：调用 AMiner API → 返回搜索结果）

# 8. 全局配置（CP-10）
aira config set aminer.token xxx
aira config list
```

---

## 风险与缓解

| 风险                                                 | 影响           | 缓解                                                   |
| ---------------------------------------------------- | -------------- | ------------------------------------------------------ |
| NPM 包名替换（721+ 文件引用 `@qwen-code/qwen-code`） | 编译失败       | CP-1 中用脚本批量替换                                  |
| OAuth 端点依赖 `chat.qwen.ai`                        | 登录失效       | 保留 Qwen OAuth 端点，只改本地显示名                   |
| Skill 格式不兼容                                     | Skill 无法加载 | 先验证 Qwen Code 的 bundled skill 格式，严格对齐       |
| TypeScript 重写 ingest 工作量大                      | 延期           | CP-5 可以先调用外部 MinerU CLI 做 MVP，TS 重写后续迭代 |
| AMiner API 变更                                      | 搜索失败       | tool 层封装错误处理，引导用户反馈                      |
| 上游 Qwen Code 更新                                  | merge conflict | 定期 rebase，保持改动模块化                            |

---

## 文件变更清单（预估）

| 类别                   | 文件数   | 说明                                                          |
| ---------------------- | -------- | ------------------------------------------------------------- |
| 身份重命名（CP-1）     | ~30      | 常量替换                                                      |
| Skill 增删（CP-2）     | ~10      | 删除旧 skill，新增 AIRA skill                                 |
| Tool 注册（CP-2/5/9）  | ~8       | 裁剪非 AIRA tool，新增 ingest/aminer tool                     |
| 审批/权限（CP-3）      | ~3       | 白名单规则注入                                                |
| Skill 内容移植（CP-4） | ~6       | 6 个 skill SKILL.md                                           |
| CLI 命令（CP-6/10）    | ~5       | 新增 `aira init` / `aira config` 子命令                       |
| UI 交互（CP-8）        | ~10      | `/change` 命令、ModeDialog、Footer 状态、Composer placeholder |
| UI 文案（CP-1）        | ~5       | 输入框、banner、帮助文案                                      |
| AMiner API（CP-9）     | ~4       | AminerSearchTool + skill 适配                                 |
| 全局配置（CP-10）      | ~4       | config.json + config 子命令                                   |
| 测试                   | ~15      | 适配现有测试，新增 AIRA 测试                                  |
| **合计**               | **~100** |                                                               |
