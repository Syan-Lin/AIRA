/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';
import { writeStdoutLine, writeStderrLine } from '../../utils/stdioHelpers.js';
import { t } from '../../i18n/index.js';

const DEFAULT_INDEX_MD = `# Project Index\n\nThis is the root index for the AIRA knowledge base.\n`;

const DEFAULT_GITIGNORE = `.DS_Store\n*.tmp\nvault/**/*.tmp\nvault/raw/images/\nvault/raw/**/*.pdf\n`;

export interface ProjectInitOptions {
  dir: string;
}

export async function runProjectInit(
  options: ProjectInitOptions,
): Promise<void> {
  const targetDir = path.resolve(options.dir);

  writeStdoutLine(
    t('Initializing AIRA project in {{dir}}...', { dir: targetDir }),
  );

  try {
    fs.mkdirSync(targetDir, { recursive: true });

    // Create vault/
    const vaultDir = path.join(targetDir, 'vault');
    if (!fs.existsSync(vaultDir)) {
      fs.mkdirSync(vaultDir, { recursive: true });
      writeStdoutLine(
        t('Created {{file}}', { file: path.join(targetDir, 'vault') }),
      );
    } else {
      writeStdoutLine(
        t('Skipped existing {{file}}', { file: path.join(targetDir, 'vault') }),
      );
    }

    // Create vault/index.md
    const indexPath = path.join(vaultDir, 'index.md');
    if (!fs.existsSync(indexPath)) {
      fs.writeFileSync(indexPath, DEFAULT_INDEX_MD, 'utf8');
      writeStdoutLine(t('Created {{file}}', { file: indexPath }));
    } else {
      writeStdoutLine(t('Skipped existing {{file}}', { file: indexPath }));
    }

    // Create .gitignore
    const gitignorePath = path.join(targetDir, '.gitignore');
    if (!fs.existsSync(gitignorePath)) {
      fs.writeFileSync(gitignorePath, DEFAULT_GITIGNORE, 'utf8');
      writeStdoutLine(t('Created {{file}}', { file: gitignorePath }));
    } else {
      writeStdoutLine(t('Skipped existing {{file}}', { file: gitignorePath }));
    }

    // Git initialization
    try {
      const isInsideGitRepo = checkIsInsideGitRepo(targetDir);
      if (!isInsideGitRepo) {
        execSync('git init', { cwd: targetDir, stdio: 'ignore' });
        writeStdoutLine(t('Initialized git repository.'));
      } else {
        writeStdoutLine(t('Git repository already exists.'));
      }

      execSync('git add .', { cwd: targetDir, stdio: 'ignore' });
      execSync('git commit -m "Initial AIRA project setup"', {
        cwd: targetDir,
        stdio: 'ignore',
      });
    } catch (gitError) {
      writeStderrLine(
        t('Git initialization skipped.', {
          error:
            gitError instanceof Error ? gitError.message : String(gitError),
        }),
      );
    }

    writeStdoutLine(t('AIRA project initialized successfully.'));
  } catch (error) {
    writeStderrLine(
      t('Failed to initialize project: {{error}}', {
        error: error instanceof Error ? error.message : String(error),
      }),
    );
    process.exit(1);
  }
}

function checkIsInsideGitRepo(cwd: string): boolean {
  try {
    execSync('git rev-parse --is-inside-work-tree', {
      cwd,
      stdio: 'ignore',
    });
    return true;
  } catch {
    return false;
  }
}
