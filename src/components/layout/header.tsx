'use client';

import { useState } from 'react';
import { useTopologyStore } from '@/store/topology-store';
import { exportAsJSON, exportAsYAML, exportAsCSV } from '@/lib/export';
import { ImportModal } from '@/components/modals/import-modal';

export function Header() {
  const { getTopology, resetTopology, loadTopology, metadata } = useTopologyStore();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const getFilename = () => metadata.name.replace(/\s+/g, '-') || 'topology';

  const handleExportJSON = () => {
    const topology = getTopology();
    exportAsJSON(topology, getFilename());
    setShowExportMenu(false);
  };

  const handleExportYAML = () => {
    const topology = getTopology();
    exportAsYAML(topology, getFilename());
    setShowExportMenu(false);
  };

  const handleExportCSV = async () => {
    const topology = getTopology();
    await exportAsCSV(topology, getFilename());
    setShowExportMenu(false);
  };

  const handleImportJSONYAML = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.yaml,.yml';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const content = event.target?.result as string;
            let topology;

            if (file.name.endsWith('.json')) {
              topology = JSON.parse(content);
            } else if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
              // YAML support would require js-yaml import
              topology = JSON.parse(content); // Fallback to JSON for now
            }

            loadTopology(topology);
          } catch (error) {
            alert('Failed to load topology file');
            console.error(error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
    setShowImportMenu(false);
  };

  const handleImportCSV = () => {
    setShowImportMenu(false);
    setShowImportModal(true);
  };

  const handleNew = () => {
    if (confirm('Are you sure you want to create a new topology? All unsaved changes will be lost.')) {
      resetTopology();
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b bg-white relative">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold">Team Topologies Designer</h1>
        <span className="text-sm text-gray-500">{metadata.name}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleNew}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded"
        >
          New
        </button>

        {/* Import dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowImportMenu(!showImportMenu)}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            Import ▾
          </button>

          {showImportMenu && (
            <div className="absolute left-0 mt-1 w-56 bg-white border rounded shadow-lg z-10">
              <button
                onClick={handleImportJSONYAML}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Import from JSON/YAML
              </button>
              <button
                onClick={handleImportCSV}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Import from CSV (ZIP)
              </button>
            </div>
          )}
        </div>

        {/* Export dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Export ▾
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white border rounded shadow-lg z-10">
              <button
                onClick={handleExportJSON}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Export as JSON
              </button>
              <button
                onClick={handleExportYAML}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Export as YAML
              </button>
              <button
                onClick={handleExportCSV}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Export as CSV (ZIP)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menus */}
      {(showExportMenu || showImportMenu) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowExportMenu(false);
            setShowImportMenu(false);
          }}
        />
      )}

      {/* Import Modal */}
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />
    </header>
  );
}
