# QWEN.md — Qwen Code Project Context

## Project Overview

**Qwen Code** is an open-source AI agent that lives in your terminal, optimized for Qwen series models. It helps developers understand large codebases, automate tedious work, and ship faster. The project is based on [Google Gemini CLI](https://github.com/google-gemini/gemini-cli) with parser-level adaptations to better support Qwen-Coder models.

**Key features:**

- Multi-protocol support (OpenAI / Anthropic / Gemini-compatible APIs)
- OAuth free tier (Qwen OAuth)
- Agentic workflow with built-in Skills and SubAgents
- Terminal-first, IDE-friendly (VS Code, Zed, JetBrains)
- Interactive mode, headless mode, and TypeScript SDK

**Version:** 0.14.4
**License:** Apache-2.0

## Tech Stack

- **Runtime:** Node.js >= 20 (development requires ~20.19.0)
- **Language:** TypeScript (strict mode)
- **Module System:** ESM (`"type": "module"`)
- **Testing:** Vitest
- **Linting:** ESLint 9 + Prettier
- **Bundler:** esbuild
- **Package Manager:** npm workspaces

## Project Structure

```
packages/
  cli/              — Command-line interface (main entry point)
  core/             — Core backend logic for Qwen Code
  sdk-typescript/   — TypeScript SDK for building on top of Qwen Code
  sdk-java/         — Java SDK
  channels/         — Channel integrations (telegram, weixin, dingtalk, etc.)
  vscode-ide-companion/ — VS Code companion extension
  zed-extension/    — Zed IDE extension
  webui/            — Web UI components
  web-templates/    — Web templates
docs/               — Documentation content
docs-site/          — Documentation site (Next.js)
scripts/            — Build, test, and utility scripts
integration-tests/  — E2E and integration test suite
eslint-rules/       — Custom ESLint rules
```

## Building and Running

### Prerequisites

- Node.js ~20.19.0 for development (use nvm or similar)
- npm

### Setup

```bash
npm install        # Install all dependencies
npm run build      # Build all packages (TypeScript compilation + asset copying)
npm run bundle     # Bundle dist/ into a single dist/cli.js via esbuild
npm start          # Start the CLI from source
```

### Development

```bash
npm run dev        # Development mode with hot reload
npm run debug      # Debug mode with --inspect-brk (attach debugger)
```

### Full Build (including sandbox)

```bash
npm run build:all  # Build everything including sandbox container
```

## Testing

### Unit Tests

Run from within the specific package directory:

```bash
cd packages/core && npx vitest run src/path/to/file.test.ts
cd packages/cli && npx vitest run src/path/to/file.test.ts
```

Update snapshots:

```bash
cd packages/cli && npx vitest run src/path/to/file.test.ts --update
```

### Integration / E2E Tests

```bash
npm run test:integration:cli:sandbox:none         # CLI tests without sandbox
npm run test:integration:interactive:sandbox:none # Interactive tests without sandbox
npm run test:e2e                                  # Full E2E test suite
```

### Full Preflight Check

```bash
npm run preflight  # clean → install → format → lint → build → typecheck → test
```

## Linting & Formatting

```bash
npm run lint       # ESLint check
npm run lint:fix   # Auto-fix lint issues
npm run format     # Prettier formatting
npm run typecheck  # TypeScript type checking
```

## Code Conventions

- **TypeScript**: Strict mode — `noImplicitAny`, `strictNullChecks`, `noUnusedLocals`, `verbatimModuleSyntax`
- **Formatting**: Prettier — single quotes, semicolons, trailing commas, 2-space indent, 80-char width
- **Linting**: No `any` types, consistent type imports, no relative imports between packages
- **Tests**: Collocated with source (`file.test.ts` next to `file.ts`), vitest framework
- **Commits**: Conventional Commits (e.g., `feat(cli): Add --json flag`)
- **Imports**: Pay special attention to import paths — ESLint enforces restrictions on relative imports between packages

## Key Configuration Files

| File                | Purpose                                           |
| ------------------- | ------------------------------------------------- |
| `package.json`      | Root workspace config, scripts, dependencies      |
| `tsconfig.json`     | TypeScript compiler options (strict mode)         |
| `eslint.config.js`  | ESLint configuration                              |
| `.prettierrc.json`  | Prettier formatting rules                         |
| `esbuild.config.js` | Bundling configuration                            |
| `vitest.config.ts`  | Root Vitest configuration                         |
| `AGENTS.md`         | Guidance for Qwen Code agent working on this repo |

## GitHub Operations

Use the `gh` CLI for all GitHub operations (issues, PRs, CI checks, releases, API calls).

### Pull Request Guidelines

- Link to an existing issue
- Keep PRs small and atomic
- Use Draft PRs for work-in-progress
- Ensure all checks pass (`npm run preflight`)
- Update documentation for user-facing changes
- Include screenshots/video demos
- Write clear commit messages (Conventional Commits)

## Debugging

### VS Code

- Press `F5` to launch the CLI in debug mode
- Or run `npm run debug` and attach via `chrome://inspect`

### React DevTools (for CLI UI)

```bash
DEV=true npm start
npx react-devtools@4.28.5
```

## Sandboxing

Sandboxing is highly recommended. Set `QWEN_SANDBOX=true` in your `~/.env` and ensure a sandboxing provider is available (macOS Seatbelt, docker, or podman).

## Publishing

```bash
npm run clean
npm install
npm run auth
npm run prerelease:dev
npm publish --workspaces
```

## Useful Links

- **Documentation:** https://qwenlm.github.io/qwen-code-docs/
- **npm:** https://www.npmjs.com/package/@qwen-code/qwen-code
- **GitHub:** https://github.com/QwenLM/qwen-code
- **Discord:** https://discord.gg/RN7tqZCeDK
