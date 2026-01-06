'use client';

import { useState, useEffect } from 'react';
import { useTopologyStore } from '@/store/topology-store';
import { INTERACTION_MODES } from '@/lib/constants';
import { InteractionMode } from '@/types/team';

interface InteractionPropertiesProps {
  interactionId: string;
}

export function InteractionProperties({ interactionId }: InteractionPropertiesProps) {
  const { getInteractionById, updateInteraction, deleteInteraction, getTeamById } =
    useTopologyStore();
  const interaction = getInteractionById(interactionId);

  const [description, setDescription] = useState(interaction?.description || '');
  const [label, setLabel] = useState(interaction?.label || '');

  useEffect(() => {
    if (interaction) {
      setDescription(interaction.description || '');
      setLabel(interaction.label || '');
    }
  }, [interaction]);

  if (!interaction) {
    return <div className="p-4 text-gray-500">Interaction not found</div>;
  }

  const sourceTeam = getTeamById(interaction.sourceTeamId);
  const targetTeam = getTeamById(interaction.targetTeamId);

  const handleSave = () => {
    updateInteraction(interactionId, {
      description,
      label,
    });
  };

  const handleModeChange = (newMode: InteractionMode) => {
    updateInteraction(interactionId, { mode: newMode });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this interaction?')) {
      deleteInteraction(interactionId);
    }
  };

  const modeInfo = INTERACTION_MODES[interaction.mode];

  return (
    <div className="p-4 space-y-6">
      {/* Teams Info */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Teams</h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-600">Source:</span>{' '}
            <span className="font-medium">{sourceTeam?.name || 'Unknown'}</span>
          </div>
          <div>
            <span className="text-gray-600">Target:</span>{' '}
            <span className="font-medium">{targetTeam?.name || 'Unknown'}</span>
          </div>
        </div>
      </div>

      {/* Interaction Mode */}
      <div>
        <label className="block text-sm font-medium mb-2">Interaction Mode</label>
        <div className="space-y-2">
          {Object.values(INTERACTION_MODES).map((mode) => (
            <button
              key={mode.mode}
              onClick={() => handleModeChange(mode.mode)}
              className={`w-full p-3 rounded border-2 text-left transition-all ${
                interaction.mode === mode.mode
                  ? 'border-current bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{
                borderColor: interaction.mode === mode.mode ? mode.color : undefined,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-8 h-1 rounded"
                  style={{
                    backgroundColor: mode.color,
                    borderStyle: mode.strokeStyle === 'dashed' ? 'dashed' : 'solid',
                    borderWidth: mode.strokeStyle === 'dashed' ? '1px' : '0',
                    borderColor: mode.color,
                  }}
                />
                <span className="font-medium text-sm">{mode.label}</span>
              </div>
              <p className="text-xs text-gray-600">{mode.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Label */}
      <div>
        <label className="block text-sm font-medium mb-1">Label</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleSave}
          placeholder="e.g., Auth, Payment API"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Short label shown on the edge</p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleSave}
          rows={3}
          placeholder="Describe the interaction..."
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Actions */}
      <div className="pt-4 border-t">
        <button
          onClick={handleDelete}
          className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
        >
          Delete Interaction
        </button>
      </div>
    </div>
  );
}
