'use client';

import { useTopologyStore } from '@/store/topology-store';
import { TeamProperties } from './team-properties';
import { InteractionProperties } from './interaction-properties';

export function PropertiesPanel() {
  const { selectedTeamId, selectedInteractionId, selectTeam, selectInteraction } =
    useTopologyStore();

  const hasSelection = selectedTeamId || selectedInteractionId;

  if (!hasSelection) {
    return null;
  }

  const handleClose = () => {
    selectTeam(null);
    selectInteraction(null);
  };

  return (
    <aside className="w-80 border-l bg-white overflow-y-auto">
      <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
        <h2 className="font-semibold">
          {selectedTeamId ? 'Team Properties' : 'Interaction Properties'}
        </h2>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      {selectedTeamId && <TeamProperties teamId={selectedTeamId} />}
      {selectedInteractionId && <InteractionProperties interactionId={selectedInteractionId} />}
    </aside>
  );
}
