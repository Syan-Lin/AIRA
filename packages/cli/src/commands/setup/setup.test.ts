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

describe('runGlobalSetup', () => {
  beforeEach(() => {
    stdoutLines.length = 0;
    stderrLines.length = 0;
    fsStore.clear();
    dirs.clear();

    vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit');
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates global dir and AIRA.md when missing', async () => {
    await runGlobalSetup();

    expect(dirs.has('/home/user/.aira')).toBe(true);
    expect(fsStore.get('/home/user/.aira/AIRA.md')).toBe('');

    expect(stdoutLines).toContain(
      'Setting up global AIRA configuration in /home/user/.aira...',
    );
    expect(stdoutLines).toContain('Global AIRA configuration completed.');
  });

  it('skips existing files', async () => {
    dirs.add('/home/user/.aira');
    fsStore.set('/home/user/.aira/AIRA.md', 'existing');

    await runGlobalSetup();

    expect(fsStore.get('/home/user/.aira/AIRA.md')).toBe('existing');
    expect(stdoutLines.some((m) => m.includes('Skipped existing'))).toBe(true);
    expect(stdoutLines).toContain('Global AIRA configuration completed.');
  });

  it('exits with code 1 on fatal errors', async () => {
    const { mkdirSync } = await import('node:fs');
    vi.mocked(mkdirSync).mockImplementation(() => {
      throw new Error('permission denied');
    });

    await expect(runGlobalSetup()).rejects.toThrow('process.exit');
    expect(
      stderrLines.some((m) => m.includes('Failed to setup global config')),
    ).toBe(true);
  });
});
