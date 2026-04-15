/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule, Argv } from 'yargs';
import { t } from '../i18n/index.js';
import { runProjectInit } from './init/handler.js';

export const initCommand: CommandModule = {
  command: 'init',
  describe: t('Initialize an AIRA project in the current directory'),
  builder: (yargs: Argv) =>
    yargs.option('dir', {
      describe: t('Target directory for the AIRA project'),
      type: 'string',
      default: process.cwd(),
    }),
  handler: async (argv) => {
    await runProjectInit({ dir: argv['dir'] as string });
    process.exit(0);
  },
};
