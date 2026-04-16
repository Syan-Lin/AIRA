/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, useCallback } from 'react';

export type AiraMode = 'ingest' | 'research' | 'health' | 'unselected';

interface AiraModeContextValue {
  airaMode: AiraMode;
  setAiraMode: (mode: AiraMode) => void;
  isAiraModeDialogOpen: boolean;
  openAiraModeDialog: () => void;
  closeAiraModeDialog: () => void;
}

const AiraModeContext = createContext<AiraModeContextValue | null>(null);

export function AiraModeProvider({ children }: { children: React.ReactNode }) {
  const [airaMode, setAiraModeState] = useState<AiraMode>('unselected');
  const [isAiraModeDialogOpen, setIsAiraModeDialogOpen] = useState(false);

  const setAiraMode = useCallback((mode: AiraMode) => {
    setAiraModeState(mode);
  }, []);

  const openAiraModeDialog = useCallback(() => {
    setIsAiraModeDialogOpen(true);
  }, []);

  const closeAiraModeDialog = useCallback(() => {
    setIsAiraModeDialogOpen(false);
  }, []);

  return (
    <AiraModeContext.Provider
      value={{
        airaMode,
        setAiraMode,
        isAiraModeDialogOpen,
        openAiraModeDialog,
        closeAiraModeDialog,
      }}
    >
      {children}
    </AiraModeContext.Provider>
  );
}

export function useAiraMode(): AiraModeContextValue {
  const context = useContext(AiraModeContext);
  if (!context) {
    throw new Error('useAiraMode must be used within an AiraModeProvider');
  }
  return context;
}
