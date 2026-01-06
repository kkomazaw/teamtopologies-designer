'use client';

import { useTopologyStore } from '@/store/topology-store';
import { COGNITIVE_LOAD_SCALE } from '@/lib/constants';

interface CognitiveLoadSectionProps {
  teamId: string;
}

export function CognitiveLoadSection({ teamId }: CognitiveLoadSectionProps) {
  const { getTeamById, updateTeam } = useTopologyStore();
  const team = getTeamById(teamId);

  if (!team) return null;

  const cognitiveLoad = team.cognitiveLoad || {
    domain: 5,
    technical: 5,
    scope: 5,
  };

  const handleUpdate = (field: 'domain' | 'technical' | 'scope', value: number) => {
    updateTeam(teamId, {
      cognitiveLoad: {
        ...cognitiveLoad,
        [field]: value,
      },
    });
  };

  const getLoadLevel = (value: number): { label: string; color: string } => {
    if (value <= COGNITIVE_LOAD_SCALE.LOW_THRESHOLD) {
      return { label: 'Low', color: 'text-green-600' };
    } else if (value >= COGNITIVE_LOAD_SCALE.HIGH_THRESHOLD) {
      return { label: 'High', color: 'text-red-600' };
    } else {
      return { label: 'Medium', color: 'text-yellow-600' };
    }
  };

  const totalLoad = cognitiveLoad.domain + cognitiveLoad.technical + cognitiveLoad.scope;
  const averageLoad = totalLoad / 3;
  const overallLevel = getLoadLevel(averageLoad);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-600 mb-4">
          Cognitive load indicates the mental effort required to work in this team.
          Team Topologies recommends keeping cognitive load manageable to maintain team effectiveness.
        </p>

        {/* Overall Score */}
        <div className="p-4 bg-gray-50 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Cognitive Load</span>
            <span className={`text-lg font-bold ${overallLevel.color}`}>
              {averageLoad.toFixed(1)}/10 - {overallLevel.label}
            </span>
          </div>
        </div>
      </div>

      {/* Domain Complexity */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Domain Complexity</label>
          <span className={`text-sm font-semibold ${getLoadLevel(cognitiveLoad.domain).color}`}>
            {cognitiveLoad.domain}/10
          </span>
        </div>
        <input
          type="range"
          min={COGNITIVE_LOAD_SCALE.MIN}
          max={COGNITIVE_LOAD_SCALE.MAX}
          value={cognitiveLoad.domain}
          onChange={(e) => handleUpdate('domain', parseInt(e.target.value))}
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-1">
          How complex is the business domain this team works in?
        </p>
      </div>

      {/* Technical Complexity */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Technical Complexity</label>
          <span className={`text-sm font-semibold ${getLoadLevel(cognitiveLoad.technical).color}`}>
            {cognitiveLoad.technical}/10
          </span>
        </div>
        <input
          type="range"
          min={COGNITIVE_LOAD_SCALE.MIN}
          max={COGNITIVE_LOAD_SCALE.MAX}
          value={cognitiveLoad.technical}
          onChange={(e) => handleUpdate('technical', parseInt(e.target.value))}
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-1">
          How technically challenging is the work?
        </p>
      </div>

      {/* Scope */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Breadth of Responsibility</label>
          <span className={`text-sm font-semibold ${getLoadLevel(cognitiveLoad.scope).color}`}>
            {cognitiveLoad.scope}/10
          </span>
        </div>
        <input
          type="range"
          min={COGNITIVE_LOAD_SCALE.MIN}
          max={COGNITIVE_LOAD_SCALE.MAX}
          value={cognitiveLoad.scope}
          onChange={(e) => handleUpdate('scope', parseInt(e.target.value))}
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-1">
          How broad is the scope of the team's responsibilities?
        </p>
      </div>

      {/* Recommendations */}
      {averageLoad >= COGNITIVE_LOAD_SCALE.HIGH_THRESHOLD && (
        <div className="p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-800">
            <strong>Warning:</strong> High cognitive load detected. Consider:
          </p>
          <ul className="text-xs text-red-700 mt-2 ml-4 list-disc space-y-1">
            <li>Splitting the team or reducing scope</li>
            <li>Adding an Enabling Team to help</li>
            <li>Simplifying technical architecture</li>
            <li>Offloading work to a Platform Team</li>
          </ul>
        </div>
      )}
    </div>
  );
}
