/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Text } from 'ink';
import { theme } from '../semantic-colors.js';
import type { AiraMode } from '../contexts/AiraModeContext.js';

interface AiraModeHintProps {
  mode: AiraMode;
}

const modeHints: Record<AiraMode, string> = {
  ingest: '📥 添加内容 — 论文、想法、实验数据入库',
  research: '🔍 提问分析 — 基于知识库回答问题',
  health: '💚 健康检查 — 检查链接、断链、孤立文档',
  unselected: '',
};

export function AiraModeHint({ mode }: AiraModeHintProps) {
  if (mode === 'unselected') {
    return null;
  }

  return (
    <Text color={theme.text.secondary}>
      {modeHints[mode]} | /change 或 Ctrl+M 切换模式
    </Text>
  );
}
