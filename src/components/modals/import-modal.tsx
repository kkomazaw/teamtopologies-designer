'use client';

import { useState, useRef } from 'react';
import { importFromCSVZip } from '@/lib/import';
import { useTopologyStore } from '@/store/topology-store';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const [mode, setMode] = useState<'replace' | 'merge'>('replace');
  const [isImporting, setIsImporting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { loadTopology, teams, interactions, metadata } = useTopologyStore();

  if (!isOpen) return null;

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setErrors([]);
    setWarnings([]);

    try {
      const result = await importFromCSVZip(file, mode);

      if (!result.success) {
        setErrors(result.errors);
        setWarnings(result.warnings);
        setIsImporting(false);
        return;
      }

      if (result.warnings.length > 0) {
        setWarnings(result.warnings);
      }

      if (result.topology) {
        if (mode === 'merge') {
          // Merge mode: combine with existing data
          const mergedTopology = {
            ...result.topology,
            teams: [...teams, ...result.topology.teams],
            interactions: [...interactions, ...result.topology.interactions],
            metadata: {
              ...metadata,
              updatedAt: new Date().toISOString(),
            },
          };
          loadTopology(mergedTopology);
        } else {
          // Replace mode: overwrite all data
          loadTopology(result.topology);
        }

        // Close modal after successful import
        setTimeout(() => {
          onClose();
          setIsImporting(false);
          setErrors([]);
          setWarnings([]);
        }, 1000);
      }
    } catch (error) {
      setErrors([`Import failed: ${error instanceof Error ? error.message : String(error)}`]);
      setIsImporting(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    setErrors([]);
    setWarnings([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold">Import from CSV (ZIP)</h2>

        <div className="space-y-4">
          {/* Mode selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Import Mode</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="replace"
                  checked={mode === 'replace'}
                  onChange={(e) => setMode(e.target.value as 'replace')}
                  className="w-4 h-4"
                />
                <div>
                  <div className="text-sm font-medium">Replace</div>
                  <div className="text-xs text-gray-500">
                    Replace all existing teams and interactions with imported data
                  </div>
                </div>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="merge"
                  checked={mode === 'merge'}
                  onChange={(e) => setMode(e.target.value as 'merge')}
                  className="w-4 h-4"
                />
                <div>
                  <div className="text-sm font-medium">Merge</div>
                  <div className="text-xs text-gray-500">
                    Add imported teams and interactions to existing data
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* File input */}
          <div>
            <label className="block text-sm font-medium mb-2">Select ZIP File</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip"
              onChange={handleFileSelect}
              disabled={isImporting}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              ZIP file should contain: teams.csv, services.csv, dependencies.csv, interactions.csv, repositories.csv
            </p>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-sm font-semibold text-red-800 mb-1">Errors:</p>
              <ul className="text-xs text-red-700 space-y-1 ml-4 list-disc">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm font-semibold text-yellow-800 mb-1">Warnings:</p>
              <ul className="text-xs text-yellow-700 space-y-1 ml-4 list-disc">
                {warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Success message */}
          {isImporting && errors.length === 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-800">Importing...</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <button
            onClick={handleCancel}
            disabled={isImporting}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
