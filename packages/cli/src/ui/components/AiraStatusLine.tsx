/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Text } from 'ink';
import type { AiraMode } from '../contexts/AiraModeContext.js';

interface AiraStatusLineProps {
  mode: AiraMode;
}

export function AiraStatusLine({ mode }: AiraStatusLineProps) {
  const labels: Record<AiraMode, string> = {
    ingest: '📥 添加内容',
    research: '🔍 提问分析',
    health: '💚 健康检查',
    unselected: '🎓 选择模式以开始',
  };

  return <Text>{labels[mode]}</Text>;
}
