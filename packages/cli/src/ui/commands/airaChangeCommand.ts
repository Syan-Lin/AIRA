/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SlashCommand } from './types.js';
import { CommandKind } from './types.js';
import { t } from '../../i18n/index.js';

export const airaChangeCommand: SlashCommand = {
  name: 'change',
  altNames: ['mode'],
  get description() {
    return t('切换工作模式');
  },
  kind: CommandKind.BUILT_IN,
  action: async () => ({
    type: 'dialog',
    dialog: 'aira_mode',
  }),
};
