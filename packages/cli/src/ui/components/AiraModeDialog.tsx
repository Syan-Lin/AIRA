/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useState, useMemo } from 'react';
import { Box, Text } from 'ink';
import { theme } from '../semantic-colors.js';
import { RadioButtonSelect } from './shared/RadioButtonSelect.js';
import { useKeypress } from '../hooks/useKeypress.js';
import type { AiraMode } from '../contexts/AiraModeContext.js';

interface AiraModeDialogProps {
  currentMode: AiraMode;
  onSelect: (mode: AiraMode) => void;
  onClose: () => void;
}

const modeItems: Array<{ label: string; value: AiraMode; key: string }> = [
  {
    label: '📥 添加内容    — 论文、想法、实验数据入库',
    value: 'ingest',
    key: 'ingest',
  },
  {
    label: '🔍 提问分析    — 基于知识库回答问题',
    value: 'research',
    key: 'research',
  },
  {
    label: '💚 健康检查    — 检查链接、断链、孤立文档',
    value: 'health',
    key: 'health',
  },
];

export function AiraModeDialog({
  currentMode,
  onSelect,
  onClose,
}: AiraModeDialogProps) {
  const [pendingMode, setPendingMode] = useState<AiraMode | null>(null);

  const initialIndex = useMemo(() => {
    const idx = modeItems.findIndex((item) => item.value === currentMode);
    return idx >= 0 ? idx : 0;
  }, [currentMode]);

  const handleSelect = useCallback(
    (mode: AiraMode) => {
      if (mode === currentMode) {
        onClose();
        return;
      }
      setPendingMode(mode);
    },
    [currentMode, onClose],
  );

  const handleConfirm = useCallback(
    (confirmed: boolean) => {
      if (confirmed && pendingMode) {
        onSelect(pendingMode);
      } else {
        setPendingMode(null);
      }
    },
    [pendingMode, onSelect],
  );

  useKeypress(
    (key) => {
      if (key.name === 'escape') {
        if (pendingMode) {
          setPendingMode(null);
        } else {
          onClose();
        }
        return;
      }

      if (pendingMode) {
        if (key.name === 'y' || key.name === 'return') {
          handleConfirm(true);
        } else if (key.name === 'n') {
          handleConfirm(false);
        }
        return;
      }

      if (key.name === '1') {
        handleSelect('ingest');
      } else if (key.name === '2') {
        handleSelect('research');
      } else if (key.name === '3') {
        handleSelect('health');
      }
    },
    { isActive: true },
  );

  if (pendingMode) {
    return (
      <Box
        borderStyle="round"
        borderColor={theme.border.default}
        flexDirection="column"
        padding={1}
        width="100%"
      >
        <Text bold>🔄 切换工作模式</Text>
        <Box height={1} />
        <Text>
          当前模式：
          {modeItems.find((m) => m.value === currentMode)?.label ?? currentMode}
        </Text>
        <Box height={1} />
        <Text color={theme.status.warning}>
          ⚠️ 切换模式将清空当前对话上下文
        </Text>
        <Text> 确认切换？ [Y/n]</Text>
      </Box>
    );
  }

  return (
    <Box
      borderStyle="round"
      borderColor={theme.border.default}
      flexDirection="column"
      padding={1}
      width="100%"
    >
      <Text bold>🔄 切换工作模式</Text>
      <Box height={1} />
      <Text>
        当前模式：
        {modeItems.find((m) => m.value === currentMode)?.label ?? currentMode}
      </Text>
      <Box height={1} />
      <RadioButtonSelect
        items={modeItems}
        initialIndex={initialIndex}
        onSelect={handleSelect}
        isFocused={true}
        maxItemsToShow={10}
        showScrollArrows={false}
        showNumbers={true}
      />
      <Box marginTop={1}>
        <Text color={theme.text.secondary} wrap="truncate">
          (按数字键 1-3 快速选择，Enter 确认，Esc 取消)
        </Text>
      </Box>
    </Box>
  );
}
