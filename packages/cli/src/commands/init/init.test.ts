/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as child_process from 'node:child_process';
import { runProjectInit } from './handler.js';

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

vi.mock('node:child_process');

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

describe('runProjectInit', () => {
  beforeEach(() => {
    stdoutLines.length = 0;
    stderrLines.length = 0;
    fsStore.clear();
    dirs.clear();

    vi.mocked(child_process.execSync).mockImplementation((cmd: string) => {
      if (cmd === 'git rev-parse --is-inside-work-tree') {
        throw new Error('not a repo');
      }
      return '';
    });

    vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit');
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates all expected files when none exist', async () => {
    await runProjectInit({ dir: '/tmp/test-aira' });

    expect(dirs.has('/tmp/test-aira')).toBe(true);
    expect(dirs.has('/tmp/test-aira/vault')).toBe(true);

    expect(fsStore.get('/tmp/test-aira/index.md')).toContain('# Project Index');
    expect(fsStore.get('/tmp/test-aira/.gitignore')).toContain('.DS_Store');

    expect(child_process.execSync).toHaveBeenCalledWith('git init', {
      cwd: '/tmp/test-aira',
      stdio: 'ignore',
    });
    expect(child_process.execSync).toHaveBeenCalledWith('git add .', {
      cwd: '/tmp/test-aira',
      stdio: 'ignore',
    });
    expect(child_process.execSync).toHaveBeenCalledWith(
      'git commit -m "Initial AIRA project setup"',
      { cwd: '/tmp/test-aira', stdio: 'ignore' },
    );

    expect(stdoutLines).toContain(
      'Initializing AIRA project in /tmp/test-aira...',
    );
    expect(stdoutLines).toContain('AIRA project initialized successfully.');
  });

  it('skips existing files without overwriting', async () => {
    dirs.add('/tmp/test-aira/vault');
    fsStore.set('/tmp/test-aira/index.md', 'existing');
    fsStore.set('/tmp/test-aira/.gitignore', 'existing');

    await runProjectInit({ dir: '/tmp/test-aira' });

    expect(fsStore.get('/tmp/test-aira/index.md')).toBe('existing');
    expect(fsStore.get('/tmp/test-aira/.gitignore')).toBe('existing');

    expect(stdoutLines.some((m) => m.includes('Skipped existing'))).toBe(true);
  });

  it('skips git init when already inside a repo but still runs add and commit', async () => {
    vi.mocked(child_process.execSync).mockImplementation((cmd: string) => {
      if (cmd === 'git rev-parse --is-inside-work-tree') {
        return '';
      }
      if (cmd === 'git init') {
        throw new Error('should not call git init');
      }
      return '';
    });

    await runProjectInit({ dir: '/tmp/test-aira' });

    const calls = vi.mocked(child_process.execSync).mock.calls.map((c) => c[0]);
    expect(calls).not.toContain('git init');
    expect(calls).toContain('git add .');
    expect(calls.some((c) => (c as string).includes('git commit'))).toBe(true);
  });

  it('handles git command failures gracefully and does not throw', async () => {
    vi.mocked(child_process.execSync).mockImplementation((cmd: string) => {
      if (cmd === 'git rev-parse --is-inside-work-tree') {
        throw new Error('not a repo');
      }
      if (cmd === 'git init') {
        throw new Error('git not installed');
      }
      return '';
    });

    await expect(
      runProjectInit({ dir: '/tmp/test-aira' }),
    ).resolves.not.toThrow();
    expect(
      stderrLines.some((m) => m.includes('Git initialization skipped')),
    ).toBe(true);
    expect(stdoutLines).toContain('AIRA project initialized successfully.');
  });

  it('exits with code 1 on fatal errors', async () => {
    const { mkdirSync } = await import('node:fs');
    vi.mocked(mkdirSync).mockImplementation(() => {
      throw new Error('disk full');
    });

    await expect(runProjectInit({ dir: '/tmp/test-aira' })).rejects.toThrow(
      'process.exit',
    );
    expect(
      stderrLines.some((m) => m.includes('Failed to initialize project')),
    ).toBe(true);
  });
});
