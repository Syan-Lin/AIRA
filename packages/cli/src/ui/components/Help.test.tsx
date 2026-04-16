/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/** @vitest-environment jsdom */

import { render } from 'ink-testing-library';
import { describe, it, expect } from 'vitest';
import { Help } from './Help.js';
import type { SlashCommand } from '../commands/types.js';
import { CommandKind } from '../commands/types.js';

const mockCommands: readonly SlashCommand[] = [
  {
    name: 'test',
    description: 'A test command',
    kind: CommandKind.BUILT_IN,
    altNames: ['alias-one', 'alias-two'],
  },
  {
    name: 'hidden',
    description: 'A hidden command',
    hidden: true,
    kind: CommandKind.BUILT_IN,
  },
  {
    name: 'parent',
    description: 'A parent command',
    kind: CommandKind.BUILT_IN,
    subCommands: [
      {
        name: 'visible-child',
        description: 'A visible child command',
        kind: CommandKind.BUILT_IN,
      },
      {
        name: 'hidden-child',
        description: 'A hidden child command',
        hidden: true,
        kind: CommandKind.BUILT_IN,
      },
    ],
  },
  {
    name: 'skill-cmd',
    description: 'A skill command that should not appear in help',
    kind: CommandKind.SKILL,
  },
  {
    name: 'arena',
    description: 'A command hidden for AIRA context',
    kind: CommandKind.BUILT_IN,
  },
];

describe('Help Component', () => {
  it('should render platform-specific keyboard shortcuts', () => {
    const { lastFrame } = render(<Help commands={mockCommands} />);
    const output = lastFrame();

    if (process.platform === 'win32') {
      expect(output).toContain('Tab');
      expect(output).not.toContain('Shift+Tab');
    } else {
      expect(output).toContain('Shift+Tab');
    }
  });

  it('should not render hidden commands', () => {
    const { lastFrame } = render(<Help commands={mockCommands} />);
    const output = lastFrame();

    expect(output).toContain('/test');
    expect(output).not.toContain('/hidden');
  });

  it('should not render skill commands', () => {
    const { lastFrame } = render(<Help commands={mockCommands} />);
    const output = lastFrame();

    expect(output).not.toContain('skill-cmd');
    expect(output).not.toContain(
      'A skill command that should not appear in help',
    );
  });

  it('should not render AIRA denylisted commands', () => {
    const { lastFrame } = render(<Help commands={mockCommands} />);
    const output = lastFrame();

    expect(output).not.toContain('/arena');
    expect(output).not.toContain('A command hidden for AIRA context');
  });

  it('should hide auth, bug, and docs from help', () => {
    const extraCommands: readonly SlashCommand[] = [
      ...mockCommands,
      {
        name: 'auth',
        description: 'Configure authentication',
        kind: CommandKind.BUILT_IN,
        altNames: ['login'],
      },
      {
        name: 'bug',
        description: 'Submit a bug report',
        kind: CommandKind.BUILT_IN,
      },
      {
        name: 'docs',
        description: 'Open documentation',
        kind: CommandKind.BUILT_IN,
      },
    ];
    const { lastFrame } = render(<Help commands={extraCommands} />);
    const output = lastFrame();

    expect(output).not.toContain('/auth');
    expect(output).not.toContain('Configure authentication');
    expect(output).not.toContain('/bug');
    expect(output).not.toContain('Submit a bug report');
    expect(output).not.toContain('/docs');
    expect(output).not.toContain('Open documentation');
  });

  it('should render visible subcommands', () => {
    const { lastFrame } = render(<Help commands={mockCommands} />);
    const output = lastFrame();

    expect(output).toContain('visible-child');
    expect(output).not.toContain('hidden-child');
  });

  it('should render alt names for commands when available', () => {
    const { lastFrame } = render(<Help commands={mockCommands} />);
    const output = lastFrame();

    expect(output).toContain('/test (alias-one, alias-two)');
  });
});
