'use client';

import { Header } from './layout/header';
import { Sidebar } from './layout/sidebar';
import { Canvas } from './canvas/canvas';
import { PropertiesPanel } from './properties/properties-panel';
import { useAutoSave } from '@/hooks/use-auto-save';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';

export function TopologyDesigner() {
  // Enable auto-save to localStorage
  useAutoSave();

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <Header />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Canvas */}
        <Canvas />

        {/* Properties Panel */}
        <PropertiesPanel />
      </div>
    </div>
  );
}
