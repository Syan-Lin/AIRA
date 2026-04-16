/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, Text } from 'ink';
import { theme } from '../semantic-colors.js';

export function AiraStartupPrompt() {
  return (
    <Box flexDirection="column" marginTop={1} marginBottom={1}>
      <Text bold>🎓 AIRA 研究助手</Text>
      <Box height={1} />
      <Text> 选择工作模式开始使用：</Text>
      <Box height={1} />
      <Text> [1] 📥 添加内容 — 论文、想法、实验数据入库</Text>
      <Text> [2] 🔍 提问分析 — 基于知识库回答问题</Text>
      <Text> [3] 💚 健康检查 — 检查链接、断链、孤立文档</Text>
      <Box height={1} />
      <Text color={theme.text.secondary}>
        {'  '}或直接输入你的问题，我会自动识别模式
      </Text>
      <Box height={1} />
      <Text color={theme.text.secondary}>
        {'  '}/change 切换模式 | /help 查看所有命令
      </Text>
    </Box>
  );
}
