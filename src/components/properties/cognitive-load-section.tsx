'use client';

import { useTranslations } from 'next-intl';
import { useTopologyStore } from '@/store/topology-store';
import { COGNITIVE_LOAD_SCALE } from '@/lib/constants';

interface CognitiveLoadSectionProps {
  teamId: string;
}

export function CognitiveLoadSection({ teamId }: CognitiveLoadSectionProps) {
  const t = useTranslations('cognitiveLoad');
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
      return { label: t('levels.low'), color: 'text-green-600' };
    } else if (value >= COGNITIVE_LOAD_SCALE.HIGH_THRESHOLD) {
      return { label: t('levels.high'), color: 'text-red-600' };
    } else {
      return { label: t('levels.medium'), color: 'text-yellow-600' };
    }
  };

  const totalLoad = cognitiveLoad.domain + cognitiveLoad.technical + cognitiveLoad.scope;
  const averageLoad = totalLoad / 3;
  const overallLevel = getLoadLevel(averageLoad);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-600 mb-4">
          {t('description')}
        </p>

        {/* Overall Score */}
        <div className="p-4 bg-gray-50 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t('overall')}</span>
            <span className={`text-lg font-bold ${overallLevel.color}`}>
              {averageLoad.toFixed(1)}/10 - {overallLevel.label}
            </span>
          </div>
        </div>
      </div>

      {/* Domain Complexity */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">{t('domain.label')}</label>
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
          {t('domain.hint')}
        </p>
      </div>

      {/* Technical Complexity */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">{t('technical.label')}</label>
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
          {t('technical.hint')}
        </p>
      </div>

      {/* Scope */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">{t('scope.label')}</label>
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
          {t('scope.hint')}
        </p>
      </div>

      {/* Recommendations */}
      {averageLoad >= COGNITIVE_LOAD_SCALE.HIGH_THRESHOLD && (
        <div className="p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-800">
            <strong>{t('warning.title')}:</strong> {t('warning.message')}
          </p>
          <ul className="text-xs text-red-700 mt-2 ml-4 list-disc space-y-1">
            <li>{t('warning.recommendations.splitTeam')}</li>
            <li>{t('warning.recommendations.addEnablingTeam')}</li>
            <li>{t('warning.recommendations.simplifyArchitecture')}</li>
            <li>{t('warning.recommendations.offloadToPlatform')}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
