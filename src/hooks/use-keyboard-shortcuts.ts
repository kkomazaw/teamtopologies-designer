/**
 * Keyboard shortcuts hook
 */

import { useEffect } from 'react';
import { useTopologyStore } from '@/store/topology-store';

export function useKeyboardShortcuts() {
  const { selectedTeamId, selectedInteractionId, deleteTeam, deleteInteraction, selectTeam, selectInteraction } =
    useTopologyStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if we're in an input field
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Delete key - delete selected team or interaction
      if ((e.key === 'Delete' || e.key === 'Backspace') && !e.metaKey && !e.ctrlKey) {
        if (selectedTeamId) {
          if (confirm('Are you sure you want to delete this team?')) {
            deleteTeam(selectedTeamId);
          }
          e.preventDefault();
        } else if (selectedInteractionId) {
          if (confirm('Are you sure you want to delete this interaction?')) {
            deleteInteraction(selectedInteractionId);
          }
          e.preventDefault();
        }
      }

      // Escape key - deselect
      if (e.key === 'Escape') {
        selectTeam(null);
        selectInteraction(null);
        e.preventDefault();
      }

      // Cmd/Ctrl + S - Save (export JSON)
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        const topology = useTopologyStore.getState().getTopology();
        const json = JSON.stringify(topology, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${topology.metadata.name.replace(/\s+/g, '-')}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        e.preventDefault();
      }

      // Cmd/Ctrl + N - New topology
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        if (confirm('Are you sure you want to create a new topology? All unsaved changes will be lost.')) {
          useTopologyStore.getState().resetTopology();
        }
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedTeamId, selectedInteractionId, deleteTeam, deleteInteraction, selectTeam, selectInteraction]);
}
