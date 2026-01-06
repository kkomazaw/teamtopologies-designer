/**
 * Auto-save hook for persisting topology to LocalStorage
 */

import { useEffect } from 'react';
import { useTopologyStore } from '@/store/topology-store';
import { STORAGE_KEYS } from '@/lib/constants';

export function useAutoSave() {
  const { teams, interactions, metadata } = useTopologyStore();

  useEffect(() => {
    // Save to localStorage on every change
    const saveToLocalStorage = () => {
      try {
        const topology = {
          version: '1.0.0',
          metadata,
          teams,
          interactions,
        };
        localStorage.setItem(STORAGE_KEYS.AUTOSAVE, JSON.stringify(topology));
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    };

    // Debounce the save operation
    const timeoutId = setTimeout(saveToLocalStorage, 500);

    return () => clearTimeout(timeoutId);
  }, [teams, interactions, metadata]);

  // Load from localStorage on mount
  useEffect(() => {
    const loadFromLocalStorage = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.AUTOSAVE);
        if (saved) {
          const topology = JSON.parse(saved);
          useTopologyStore.getState().loadTopology(topology);
        }
      } catch (error) {
        console.error('Failed to load from localStorage:', error);
      }
    };

    loadFromLocalStorage();
  }, []);
}
