/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import prompts from 'prompts';
import {
  AuthType,
  Storage,
  getCurrentGeminiMdFilename,
  type ProviderModelConfig as ModelConfig,
} from '@qwen-code/qwen-code-core';
import { writeStdoutLine, writeStderrLine } from '../../utils/stdioHelpers.js';
import { t } from '../../i18n/index.js';
import {
  loadSettings,
  SettingScope,
  type LoadedSettings,
} from '../../config/settings.js';
import { backupSettingsFile } from '../../utils/settingsUtils.js';

type ApiKeyFormat = 'openai' | 'anthropic';

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
  } catch (error) {
    writeStderrLine(
      t('Failed to setup global config: {{error}}', {
        error: error instanceof Error ? error.message : String(error),
      }),
    );
    process.exit(1);
  }

  const settings = loadSettings();
  const settingsFile = settings.forScope(SettingScope.User);
  backupSettingsFile(settingsFile.path);

  let hasKeys = getApiKeys(settings).length > 0;

  while (true) {
    const choices: prompts.Choice[] = [
      { title: t('Manage API keys'), value: 'keys' },
      { title: t('Configure MinerU token'), value: 'mineru' },
      { title: t('Configure AMiner token'), value: 'aminer' },
    ];

    if (hasKeys) {
      choices.push({ title: t('Done'), value: 'done' });
    }

    const response = await prompts({
      type: 'select',
      name: 'action',
      message: t('What would you like to configure?'),
      choices,
      initial: 0,
    });

    if (response.action === undefined) {
      // Ctrl+C
      if (!hasKeys) {
        writeStderrLine(
          t('At least one API key is required before exiting setup.'),
        );
        continue;
      }
      break;
    }

    switch (response.action) {
      case 'keys':
        await manageApiKeys(settings);
        hasKeys = getApiKeys(settings).length > 0;
        break;
      case 'mineru':
        await configureMinerU(settings);
        break;
      case 'aminer':
        await configureAMiner(settings);
        break;
      case 'done':
        writeStdoutLine(t('Global AIRA configuration completed.'));
        return;
      default:
        break;
    }
  }

  writeStdoutLine(t('Global AIRA configuration completed.'));
}

function getApiKeys(settings: LoadedSettings): ModelConfig[] {
  const providers = settings.merged.modelProviders as
    | Record<string, ModelConfig[]>
    | undefined;
  return providers?.[AuthType.USE_OPENAI] ?? [];
}

async function manageApiKeys(settings: LoadedSettings): Promise<void> {
  while (true) {
    const keys = getApiKeys(settings);
    const choices: prompts.Choice[] = [];

    if (keys.length === 0) {
      choices.push({
        title: t('No API keys configured.'),
        value: 'none',
        disabled: true,
      });
    } else {
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        choices.push({
          title: `${k.id} (${k.baseUrl ?? 'default'})`,
          value: `view-${i}`,
          disabled: true,
        });
        choices.push({
          title: `  ${t('Delete')}`,
          value: `del-${i}`,
        });
      }
    }

    choices.push(
      { title: `+ ${t('Add new API key')}`, value: 'add' },
      { title: `< ${t('Back')}`, value: 'back' },
    );

    const response = await prompts({
      type: 'select',
      name: 'action',
      message: t('Manage API keys'),
      choices,
      initial: choices.findIndex((c) => !c.disabled && c.value !== 'back') ?? 0,
    });

    if (response.action === undefined || response.action === 'back') {
      return;
    }

    if (response.action === 'add') {
      await addApiKey(settings);
    } else if (
      typeof response.action === 'string' &&
      response.action.startsWith('del-')
    ) {
      const idx = Number(response.action.replace('del-', ''));
      if (!Number.isNaN(idx)) {
        await deleteApiKey(settings, idx);
      }
    }
  }
}

async function addApiKey(settings: LoadedSettings): Promise<void> {
  const formatResp = await prompts({
    type: 'select',
    name: 'format',
    message: t('Select API key format'),
    choices: [
      { title: t('OpenAI-compatible'), value: 'openai' },
      { title: t('Anthropic'), value: 'anthropic' },
    ],
    initial: 0,
  });

  if (formatResp.format === undefined) return;
  const format = formatResp.format as ApiKeyFormat;

  const baseUrlResp = await prompts({
    type: 'text',
    name: 'baseUrl',
    message: t('Base URL (leave empty for default)'),
    initial: '',
  });

  if (baseUrlResp.baseUrl === undefined) return;

  const modelIdResp = await prompts({
    type: 'text',
    name: 'modelId',
    message: t('Model ID (leave empty if the provider does not require one)'),
  });

  const modelId = String(modelIdResp.modelId ?? '').trim() || 'default';

  const apiKeyResp = await prompts({
    type: 'password',
    name: 'apiKey',
    message: t('API Key'),
  });

  if (!apiKeyResp.apiKey) return;
  const apiKey = String(apiKeyResp.apiKey).trim();

  const envKeyName =
    format === 'anthropic' ? 'ANTHROPIC_API_KEY' : 'OPENAI_API_KEY';
  const defaultBaseUrl =
    format === 'anthropic'
      ? 'https://api.anthropic.com/v1'
      : 'https://api.openai.com/v1';
  const baseUrl = baseUrlResp.baseUrl?.trim() || defaultBaseUrl;

  const existingEnv = settings.merged.env?.[envKeyName];
  if (existingEnv && existingEnv !== apiKey) {
    const overwrite = await prompts({
      type: 'confirm',
      name: 'value',
      message: t('An existing {{key}} is already configured. Overwrite?', {
        key: envKeyName,
      }),
      initial: false,
    });
    if (!overwrite.value) return;
  }

  const newConfig: ModelConfig = {
    id: modelId,
    name: modelId,
    baseUrl,
    envKey: envKeyName,
  };

  const existing = getApiKeys(settings);
  const updated = [...existing, newConfig];

  settings.setValue(SettingScope.User, `env.${envKeyName}`, apiKey);
  settings.setValue(
    SettingScope.User,
    `modelProviders.${AuthType.USE_OPENAI}`,
    updated,
  );
  settings.setValue(
    SettingScope.User,
    'security.auth.selectedType',
    AuthType.USE_OPENAI,
  );
  settings.setValue(SettingScope.User, 'model.name', modelId);

  // Sync to process.env immediately so any subsequent auth checks pass
  process.env[envKeyName] = apiKey;

  writeStdoutLine(t('API key saved successfully.'));
}

async function deleteApiKey(
  settings: LoadedSettings,
  index: number,
): Promise<void> {
  const existing = getApiKeys(settings);
  if (index < 0 || index >= existing.length) return;

  const target = existing[index];
  const confirm = await prompts({
    type: 'confirm',
    name: 'value',
    message: t('Delete API key for {{model}}?', { model: target.id }),
    initial: false,
  });

  if (!confirm.value) return;

  const updated = existing.filter((_, i) => i !== index);
  settings.setValue(
    SettingScope.User,
    `modelProviders.${AuthType.USE_OPENAI}`,
    updated,
  );

  if (updated.length === 0) {
    settings.setValue(
      SettingScope.User,
      'security.auth.selectedType',
      undefined,
    );
    settings.setValue(SettingScope.User, 'model.name', undefined);
  }

  writeStdoutLine(t('API key deleted.'));
}

async function configureMinerU(settings: LoadedSettings): Promise<void> {
  const resp = await prompts({
    type: 'password',
    name: 'token',
    message: t('Enter MinerU token'),
  });

  if (!resp.token) return;

  settings.setValue(
    SettingScope.User,
    'env.MINERU_API_KEY',
    String(resp.token).trim(),
  );
  process.env['MINERU_API_KEY'] = String(resp.token).trim();
  writeStdoutLine(t('Token saved successfully.'));
}

async function configureAMiner(settings: LoadedSettings): Promise<void> {
  const resp = await prompts({
    type: 'password',
    name: 'token',
    message: t('Enter AMiner token'),
  });

  if (!resp.token) return;

  settings.setValue(
    SettingScope.User,
    'env.AMINER_API_KEY',
    String(resp.token).trim(),
  );
  process.env['AMINER_API_KEY'] = String(resp.token).trim();
  writeStdoutLine(t('Token saved successfully.'));
}
