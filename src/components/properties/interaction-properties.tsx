'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useTopologyStore } from '@/store/topology-store';
import { INTERACTION_MODES } from '@/lib/constants';
import { InteractionMode } from '@/types/team';

interface InteractionPropertiesProps {
  interactionId: string;
}

export function InteractionProperties({ interactionId }: InteractionPropertiesProps) {
  const t = useTranslations('interactions');
  const tModes = useTranslations('interactionModes');
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
    return <div className="p-4 text-gray-500">{t('notFound')}</div>;
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
    if (confirm(t('deleteConfirm'))) {
      deleteInteraction(interactionId);
    }
  };

  const modeInfo = INTERACTION_MODES[interaction.mode];

  return (
    <div className="p-4 space-y-6">
      {/* Teams Info */}
      <div>
        <h3 className="text-sm font-semibold mb-2">{t('teams')}</h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-600">{t('source')}:</span>{' '}
            <span className="font-medium">{sourceTeam?.name || t('unknown')}</span>
          </div>
          <div>
            <span className="text-gray-600">{t('target')}:</span>{' '}
            <span className="font-medium">{targetTeam?.name || t('unknown')}</span>
          </div>
        </div>
      </div>

      {/* Interaction Mode */}
      <div>
        <label className="block text-sm font-medium mb-2">{t('interactionMode')}</label>
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
                <span className="font-medium text-sm">{tModes(mode.mode)}</span>
              </div>
              <p className="text-xs text-gray-600">{tModes(`${mode.mode}Desc`)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Label */}
      <div>
        <label className="block text-sm font-medium mb-1">{t('label')}</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleSave}
          placeholder={t('labelPlaceholder')}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">{t('labelHint')}</p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">{t('description')}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleSave}
          rows={3}
          placeholder={t('descriptionPlaceholder')}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Actions */}
      <div className="pt-4 border-t">
        <button
          onClick={handleDelete}
          className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
        >
          {t('deleteInteraction')}
        </button>
      </div>
    </div>
  );
}
