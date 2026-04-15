/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule } from 'yargs';
import { t } from '../i18n/index.js';
import { runGlobalSetup } from './setup/handler.js';

export const setupCommand: CommandModule = {
  command: 'setup',
  describe: t('Set up global AIRA configuration'),
  handler: async () => {
    await runGlobalSetup();
    process.exit(0);
  },
};
