'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useTopologyStore } from '@/store/topology-store';
import { TEAM_TYPES } from '@/lib/constants';
import { TeamType } from '@/types/team';
import { TeamApiSection } from './team-api-section';
import { CognitiveLoadSection } from './cognitive-load-section';

interface TeamPropertiesProps {
  teamId: string;
}

export function TeamProperties({ teamId }: TeamPropertiesProps) {
  const t = useTranslations('properties');
  const tTypes = useTranslations('teamTypes');
  const { getTeamById, updateTeam, deleteTeam } = useTopologyStore();
  const team = getTeamById(teamId);

  const [activeTab, setActiveTab] = useState<'basic' | 'team-api' | 'cognitive-load'>('basic');
  const [name, setName] = useState(team?.name || '');
  const [description, setDescription] = useState(team?.description || '');
  const [memberCount, setMemberCount] = useState(team?.memberCount?.toString() || '');
  const [techStack, setTechStack] = useState(team?.techStack?.join(', ') || '');
  const [responsibilities, setResponsibilities] = useState(team?.responsibilities?.join(', ') || '');
  const [tags, setTags] = useState(team?.tags?.join(', ') || '');

  useEffect(() => {
    if (team) {
      setName(team.name);
      setDescription(team.description);
      setMemberCount(team.memberCount?.toString() || '');
      setTechStack(team.techStack?.join(', ') || '');
      setResponsibilities(team.responsibilities?.join(', ') || '');
      setTags(team.tags?.join(', ') || '');
    }
  }, [team]);

  if (!team) {
    return <div className="p-4 text-gray-500">{t('teamNotFound')}</div>;
  }

  const handleSave = () => {
    updateTeam(teamId, {
      name,
      description,
      memberCount: memberCount ? parseInt(memberCount) : undefined,
      techStack: techStack.split(',').map(s => s.trim()).filter(Boolean),
      responsibilities: responsibilities.split(',').map(s => s.trim()).filter(Boolean),
      tags: tags.split(',').map(s => s.trim()).filter(Boolean),
    });
  };

  const handleDelete = () => {
    if (confirm(t('deleteConfirm', { name: team.name }))) {
      deleteTeam(teamId);
    }
  };

  const handleTypeChange = (newType: TeamType) => {
    updateTeam(teamId, { type: newType });
  };

  const teamTypeInfo = TEAM_TYPES[team.type];

  return (
    <div className="p-4 space-y-4">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('basic')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'basic'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('tabs.basicInfo')}
        </button>
        <button
          onClick={() => setActiveTab('team-api')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'team-api'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('tabs.teamApi')}
        </button>
        <button
          onClick={() => setActiveTab('cognitive-load')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'cognitive-load'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('tabs.cognitiveLoad')}
        </button>
      </div>

      {/* Basic Info Tab */}
      {activeTab === 'basic' && (
        <div className="space-y-6">
          {/* Team Type */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('teamType')}</label>
            <div className="space-y-2">
              {Object.values(TEAM_TYPES).map((type) => (
                <button
                  key={type.type}
                  onClick={() => handleTypeChange(type.type)}
                  className={`w-full p-2 rounded border-2 text-left transition-all ${
                    team.type === type.type
                      ? 'border-current'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{
                    borderColor: team.type === type.type ? type.color : undefined,
                    backgroundColor: team.type === type.type ? `${type.color}10` : undefined,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="text-sm font-medium">{tTypes(type.type)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium mb-1">{t('teamName')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleSave}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('description')}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSave}
              rows={3}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('memberCount')}</label>
            <input
              type="number"
              value={memberCount}
              onChange={(e) => setMemberCount(e.target.value)}
              onBlur={handleSave}
              min="1"
              max="20"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">{t('memberCountHint')}</p>
          </div>

          {/* Organization Info */}
          <div>
            <label className="block text-sm font-medium mb-1">{t('techStack')}</label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              onBlur={handleSave}
              placeholder={t('techStackPlaceholder')}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">{t('commaSeparatedHint')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('responsibilities')}</label>
            <input
              type="text"
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              onBlur={handleSave}
              placeholder={t('responsibilitiesPlaceholder')}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">{t('commaSeparatedHint')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('tags')}</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              onBlur={handleSave}
              placeholder={t('tagsPlaceholder')}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">{t('commaSeparatedHint')}</p>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t">
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              {t('deleteTeam')}
            </button>
          </div>
        </div>
      )}

      {/* Team API Tab */}
      {activeTab === 'team-api' && <TeamApiSection teamId={teamId} />}

      {/* Cognitive Load Tab */}
      {activeTab === 'cognitive-load' && <CognitiveLoadSection teamId={teamId} />}
    </div>
  );
}
