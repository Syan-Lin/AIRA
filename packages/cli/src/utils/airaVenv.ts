/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createDebugLogger } from '@qwen-code/qwen-code-core';

const debugLogger = createDebugLogger('AIRA_VENV');

export function getAiraVenvDir(): string {
  return path.join(os.homedir(), '.aira', '.venv');
}

export function getAiraVenvBinPath(): string {
  const venvDir = getAiraVenvDir();
  return os.platform() === 'win32'
    ? path.join(venvDir, 'Scripts')
    : path.join(venvDir, 'bin');
}

export function isAiraVenvReady(): boolean {
  return fs.existsSync(getAiraVenvBinPath());
}

export function getAiraInstallRoot(): string | undefined {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const candidates = [
      path.resolve(__dirname, '..'), // bundled: dist/cli.js -> dist/ -> root
      path.resolve(__dirname, '../..'), // dev: packages/cli/dist/utils/ -> root
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(path.join(candidate, 'packages', 'skills', 'ingest'))) {
        return candidate;
      }
    }
  } catch {
    // import.meta.url may not be available in some environments
  }
  return undefined;
}

export function ensureAiraVenv(projectRoot: string): {
  ok: boolean;
  message?: string;
} {
  const venvDir = getAiraVenvDir();
  const binDir = getAiraVenvBinPath();

  const pythonExe =
    os.platform() === 'win32'
      ? path.join(binDir, 'python.exe')
      : path.join(binDir, 'python');

  if (fs.existsSync(pythonExe)) {
    // Venv already exists — quick-check that aira-ingest is importable
    const check = spawnSync(pythonExe, ['-c', 'import ingest_raw'], {
      stdio: 'ignore',
    });
    if (check.status === 0) {
      debugLogger.debug('AIRA venv is ready');
      return { ok: true };
    }
    // Package missing — will install into existing venv below
  }

  // 1. Ensure uv is available
  const uvCheck = spawnSync('uv', ['--version'], {
    shell: true,
    stdio: 'ignore',
  });
  if (uvCheck.error || uvCheck.status !== 0) {
    return {
      ok: false,
      message:
        'uv is not installed. Please install uv (https://docs.astral.sh/uv/getting-started/installation/)',
    };
  }

  // 2. Create venv with uv if it doesn't exist yet
  if (!fs.existsSync(pythonExe)) {
    debugLogger.debug(`Creating AIRA venv at ${venvDir}`);
    const create = spawnSync('uv', ['venv', venvDir], { stdio: 'inherit' });
    if (create.status !== 0) {
      return { ok: false, message: `Failed to create venv at ${venvDir}` };
    }
  }

  // 3. Install ingest package into the venv
  const ingestPackageDir = path.join(
    projectRoot,
    'packages',
    'skills',
    'ingest',
  );
  if (!fs.existsSync(ingestPackageDir)) {
    return {
      ok: false,
      message: `Ingest package not found at ${ingestPackageDir}`,
    };
  }

  const uvPip = spawnSync(
    'uv',
    ['pip', 'install', '-e', ingestPackageDir, '--python', pythonExe],
    { stdio: 'inherit' },
  );
  if (uvPip.status !== 0) {
    return {
      ok: false,
      message: `Failed to install ingest package from ${ingestPackageDir}`,
    };
  }

  return { ok: true };
}
