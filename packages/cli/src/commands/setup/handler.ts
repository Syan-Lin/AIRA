/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { Storage, getCurrentGeminiMdFilename } from '@qwen-code/qwen-code-core';
import { writeStdoutLine, writeStderrLine } from '../../utils/stdioHelpers.js';
import { t } from '../../i18n/index.js';

export async function runGlobalSetup(): Promise<void> {
  const globalDir = Storage.getGlobalQwenDir();

  writeStdoutLine(
    t('Setting up global AIRA configuration in {{dir}}...', { dir: globalDir }),
  );

  try {
    fs.mkdirSync(globalDir, { recursive: true });
    writeStdoutLine(t('Created {{file}}', { file: globalDir }));

    const globalMdPath = path.join(globalDir, getCurrentGeminiMdFilename());
    if (!fs.existsSync(globalMdPath)) {
      fs.writeFileSync(globalMdPath, '', 'utf8');
      writeStdoutLine(t('Created {{file}}', { file: globalMdPath }));
    } else {
      writeStdoutLine(t('Skipped existing {{file}}', { file: globalMdPath }));
    }

    writeStdoutLine(t('Global AIRA configuration completed.'));
  } catch (error) {
    writeStderrLine(
      t('Failed to setup global config: {{error}}', {
        error: error instanceof Error ? error.message : String(error),
      }),
    );
    process.exit(1);
  }
}
