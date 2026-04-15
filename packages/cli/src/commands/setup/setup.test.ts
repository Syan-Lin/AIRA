/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { runGlobalSetup } from './handler.js';

const stdoutLines: string[] = [];
const stderrLines: string[] = [];
const fsStore = new Map<string, string>();
const dirs = new Set<string>();

let promptQueue: Array<Record<string, unknown>> = [];

vi.mock('node:fs', () => ({
  default: {
    mkdirSync: vi.fn((p: string) => {
      dirs.add(p);
    }),
    existsSync: vi.fn((p: string) => fsStore.has(p) || dirs.has(p)),
    writeFileSync: vi.fn((p: string, data: string) => {
      fsStore.set(p, data);
    }),
  },
  mkdirSync: vi.fn((p: string) => {
    dirs.add(p);
  }),
  existsSync: vi.fn((p: string) => fsStore.has(p) || dirs.has(p)),
  writeFileSync: vi.fn((p: string, data: string) => {
    fsStore.set(p, data);
  }),
}));

vi.mock('prompts', () => ({
  default: vi.fn(async () => {
    const next = promptQueue.shift();
    return next ?? {};
  }),
}));

vi.mock('../../i18n/index.js', () => ({
  t: vi.fn((str: string, params?: Record<string, string>) => {
    if (params) {
      return Object.entries(params).reduce(
        (acc, [key, value]) => acc.replace(`{{${key}}}`, value),
        str,
      );
    }
    return str;
  }),
}));

vi.mock('../../utils/stdioHelpers.js', () => ({
  writeStdoutLine: vi.fn((msg: string) => stdoutLines.push(msg)),
  writeStderrLine: vi.fn((msg: string) => stderrLines.push(msg)),
}));

vi.mock('@qwen-code/qwen-code-core', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@qwen-code/qwen-code-core')>();
  return {
    ...actual,
    Storage: {
      ...actual.Storage,
      getGlobalQwenDir: vi.fn(() => '/home/user/.aira'),
    },
    getCurrentGeminiMdFilename: vi.fn(() => 'AIRA.md'),
  };
});

const setValues: Array<{ key: string; value: unknown }> = [];

vi.mock('../../config/settings.js', () => ({
  loadSettings: vi.fn(() => ({
    merged: {
      modelProviders: {},
      env: {},
    },
    forScope: vi.fn(() => ({ path: '/home/user/.aira/settings.json' })),
    setValue: vi.fn((_scope: unknown, key: string, value: unknown) => {
      setValues.push({ key, value });
    }),
  })),
  SettingScope: { User: 'user' },
}));

vi.mock('../../utils/settingsUtils.js', () => ({
  backupSettingsFile: vi.fn(),
}));

describe('runGlobalSetup', () => {
  beforeEach(() => {
    stdoutLines.length = 0;
    stderrLines.length = 0;
    fsStore.clear();
    dirs.clear();
    promptQueue = [];
    setValues.length = 0;

    vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit');
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates global dir and AIRA.md when missing', async () => {
    promptQueue.push(
      { action: 'keys' }, // Manage API keys
      { action: 'add' }, // Add new
      { format: 'openai' },
      { baseUrl: '' },
      { modelId: 'gpt-4o' },
      { apiKey: 'sk-test' },
      { action: 'back' }, // Back from API keys
      { action: 'done' }, // Done
    );

    await runGlobalSetup();

    expect(dirs.has('/home/user/.aira')).toBe(true);
    expect(fsStore.get('/home/user/.aira/AIRA.md')).toBe('');
  });

  it('adding an API key writes expected settings', async () => {
    promptQueue.push(
      { action: 'keys' },
      { action: 'add' },
      { format: 'anthropic' },
      { baseUrl: 'https://custom.example.com/v1' },
      { modelId: 'claude-3-5-sonnet' },
      { apiKey: 'sk-ant' },
      { action: 'back' },
      { action: 'done' },
    );

    await runGlobalSetup();

    expect(
      setValues.some(
        (s) => s.key === 'env.ANTHROPIC_API_KEY' && s.value === 'sk-ant',
      ),
    ).toBe(true);
    expect(
      setValues.some(
        (s) =>
          s.key === 'security.auth.selectedType' && s.value === 'anthropic',
      ),
    ).toBe(true);
    expect(
      setValues.some(
        (s) => s.key === 'model.name' && s.value === 'claude-3-5-sonnet',
      ),
    ).toBe(true);
    expect(
      setValues.some(
        (s) =>
          s.key === 'modelProviders.anthropic' &&
          Array.isArray(s.value) &&
          (s.value as Array<{ id: string }>)[0]?.id === 'claude-3-5-sonnet',
      ),
    ).toBe(true);
  });

  it('configures MinerU token', async () => {
    promptQueue.push(
      { action: 'keys' },
      { action: 'add' },
      { format: 'openai' },
      { baseUrl: '' },
      { modelId: 'gpt-4o' },
      { apiKey: 'sk-test' },
      { action: 'back' },
      { action: 'mineru' },
      { token: 'mineru-token' },
      { action: 'done' },
    );

    await runGlobalSetup();

    expect(
      setValues.some(
        (s) => s.key === 'env.MINERU_API_KEY' && s.value === 'mineru-token',
      ),
    ).toBe(true);
  });

  it('configures AMiner token', async () => {
    promptQueue.push(
      { action: 'keys' },
      { action: 'add' },
      { format: 'openai' },
      { baseUrl: '' },
      { modelId: 'gpt-4o' },
      { apiKey: 'sk-test' },
      { action: 'back' },
      { action: 'aminer' },
      { token: 'aminer-token' },
      { action: 'done' },
    );

    await runGlobalSetup();

    expect(
      setValues.some(
        (s) => s.key === 'env.AMINER_API_KEY' && s.value === 'aminer-token',
      ),
    ).toBe(true);
  });
});
