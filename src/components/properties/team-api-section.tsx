'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useTopologyStore } from '@/store/topology-store';
import { TeamInteraction, InteractionMode } from '@/types/team';
import { generateId } from '@/lib/utils';
import { INTERACTION_MODES } from '@/lib/constants';

interface TeamApiSectionProps {
  teamId: string;
}

export function TeamApiSection({ teamId }: TeamApiSectionProps) {
  const t = useTranslations('teamApi');
  const tModes = useTranslations('interactionModes');
  const { getTeamById, updateTeam, teams } = useTopologyStore();
  const team = getTeamById(teamId);

  const [activeTab, setActiveTab] = useState<'basic' | 'work' | 'interactions'>('basic');

  if (!team) return null;

  const { teamAPI } = team;

  // Helper to update teamAPI
  const updateTeamAPI = (updates: Partial<typeof teamAPI>) => {
    updateTeam(teamId, {
      teamAPI: { ...teamAPI, ...updates },
    });
  };

  // Helper to update array fields
  const updateArrayField = (field: keyof typeof teamAPI, value: string) => {
    const arr = value.split(',').map(s => s.trim()).filter(Boolean);
    updateTeamAPI({ [field]: arr });
  };

  // Team interaction handlers
  const handleAddCurrentInteraction = () => {
    const newInteraction: TeamInteraction = {
      id: generateId('interaction'),
      teamId: teams.find(t => t.id !== teamId)?.id || '',
      interactionMode: 'x-as-a-service',
      purpose: '',
      duration: '',
    };
    updateTeamAPI({
      currentInteractions: [...teamAPI.currentInteractions, newInteraction],
    });
  };

  const handleUpdateCurrentInteraction = (interactionId: string, updates: Partial<TeamInteraction>) => {
    const updated = teamAPI.currentInteractions.map(i =>
      i.id === interactionId ? { ...i, ...updates } : i
    );
    updateTeamAPI({ currentInteractions: updated });
  };

  const handleDeleteCurrentInteraction = (interactionId: string) => {
    updateTeamAPI({
      currentInteractions: teamAPI.currentInteractions.filter(i => i.id !== interactionId),
    });
  };

  const handleAddPlannedInteraction = () => {
    const newInteraction: TeamInteraction = {
      id: generateId('interaction'),
      teamId: teams.find(t => t.id !== teamId)?.id || '',
      interactionMode: 'x-as-a-service',
      purpose: '',
      duration: '',
    };
    updateTeamAPI({
      plannedInteractions: [...teamAPI.plannedInteractions, newInteraction],
    });
  };

  const handleUpdatePlannedInteraction = (interactionId: string, updates: Partial<TeamInteraction>) => {
    const updated = teamAPI.plannedInteractions.map(i =>
      i.id === interactionId ? { ...i, ...updates } : i
    );
    updateTeamAPI({ plannedInteractions: updated });
  };

  const handleDeletePlannedInteraction = (interactionId: string) => {
    updateTeamAPI({
      plannedInteractions: teamAPI.plannedInteractions.filter(i => i.id !== interactionId),
    });
  };

  const otherTeams = teams.filter(t => t.id !== teamId);

  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded border border-blue-200">
        {t('templateNote')} <a href="https://github.com/TeamTopologies/Team-API-template" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Team API template</a> by Team Topologies
      </div>

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
          onClick={() => setActiveTab('work')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'work'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('tabs.currentWork')}
        </button>
        <button
          onClick={() => setActiveTab('interactions')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'interactions'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('tabs.interactions')}
        </button>
      </div>

      {/* Basic Info Tab */}
      {activeTab === 'basic' && (
        <div className="space-y-4">
          {/* Focus */}
          <div>
            <label className="block text-sm font-medium mb-1">{t('focus.label')}</label>
            <input
              type="text"
              value={teamAPI.focus || ''}
              onChange={(e) => updateTeamAPI({ focus: e.target.value })}
              placeholder={t('focus.placeholder')}
              className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Part of Platform */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('partOfPlatform.label')}</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={teamAPI.partOfPlatform.isPart}
                  onChange={(e) =>
                    updateTeamAPI({
                      partOfPlatform: { ...teamAPI.partOfPlatform, isPart: e.target.checked },
                    })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm">{t('partOfPlatform.checkboxLabel')}</span>
              </label>
              {teamAPI.partOfPlatform.isPart && (
                <input
                  type="text"
                  value={teamAPI.partOfPlatform.details || ''}
                  onChange={(e) =>
                    updateTeamAPI({
                      partOfPlatform: { ...teamAPI.partOfPlatform, details: e.target.value },
                    })
                  }
                  placeholder={t('partOfPlatform.placeholder')}
                  className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          </div>

          {/* Provides Service */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('providesService.label')}</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={teamAPI.providesServiceToOtherTeams.provides}
                  onChange={(e) =>
                    updateTeamAPI({
                      providesServiceToOtherTeams: {
                        ...teamAPI.providesServiceToOtherTeams,
                        provides: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm">{t('providesService.checkboxLabel')}</span>
              </label>
              {teamAPI.providesServiceToOtherTeams.provides && (
                <input
                  type="text"
                  value={teamAPI.providesServiceToOtherTeams.details || ''}
                  onChange={(e) =>
                    updateTeamAPI({
                      providesServiceToOtherTeams: {
                        ...teamAPI.providesServiceToOtherTeams,
                        details: e.target.value,
                      },
                    })
                  }
                  placeholder={t('providesService.placeholder')}
                  className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          </div>

          {/* Service Level Expectations */}
          <div>
            <label className="block text-sm font-medium mb-1">{t('serviceLevelExpectations.label')}</label>
            <textarea
              value={teamAPI.serviceLevelExpectations || ''}
              onChange={(e) => updateTeamAPI({ serviceLevelExpectations: e.target.value })}
              placeholder={t('serviceLevelExpectations.placeholder')}
              rows={2}
              className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Software Owned */}
          <div>
            <label className="block text-sm font-medium mb-1">{t('softwareOwned.label')}</label>
            <input
              type="text"
              value={teamAPI.softwareOwned.join(', ')}
              onChange={(e) => updateArrayField('softwareOwned', e.target.value)}
              placeholder={t('softwareOwned.placeholder')}
              className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">{t('commaSeparatedHint')}</p>
          </div>

          {/* Versioning Approaches */}
          <div>
            <label className="block text-sm font-medium mb-1">{t('versioningApproaches.label')}</label>
            <input
              type="text"
              value={teamAPI.versioningApproaches || ''}
              onChange={(e) => updateTeamAPI({ versioningApproaches: e.target.value })}
              placeholder={t('versioningApproaches.placeholder')}
              className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Wiki Search Terms */}
          <div>
            <label className="block text-sm font-medium mb-1">{t('wikiSearchTerms.label')}</label>
            <input
              type="text"
              value={teamAPI.wikiSearchTerms.join(', ')}
              onChange={(e) => updateArrayField('wikiSearchTerms', e.target.value)}
              placeholder={t('wikiSearchTerms.placeholder')}
              className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">{t('wikiSearchTerms.hint')}</p>
          </div>

          {/* Chat Channels */}
          <div>
            <label className="block text-sm font-medium mb-1">{t('chatChannels.label')}</label>
            <input
              type="text"
              value={teamAPI.chatChannels.join(', ')}
              onChange={(e) => updateArrayField('chatChannels', e.target.value)}
              placeholder={t('chatChannels.placeholder')}
              className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">{t('chatChannels.hint')}</p>
          </div>

          {/* Daily Sync Time */}
          <div>
            <label className="block text-sm font-medium mb-1">{t('dailySyncTime.label')}</label>
            <input
              type="text"
              value={teamAPI.dailySyncTime || ''}
              onChange={(e) => updateTeamAPI({ dailySyncTime: e.target.value })}
              placeholder={t('dailySyncTime.placeholder')}
              className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Current Work Tab */}
      {activeTab === 'work' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{t('work.subtitle')}</p>

          {/* Services and Systems */}
          <div>
            <label className="block text-sm font-medium mb-1">{t('work.servicesAndSystems.label')}</label>
            <textarea
              value={teamAPI.currentWork.servicesAndSystems.join('\n')}
              onChange={(e) =>
                updateTeamAPI({
                  currentWork: {
                    ...teamAPI.currentWork,
                    servicesAndSystems: e.target.value.split('\n').filter(Boolean),
                  },
                })
              }
              placeholder={t('work.servicesAndSystems.placeholder')}
              rows={4}
              className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">{t('onePerLineHint')}</p>
          </div>

          {/* Ways of Working */}
          <div>
            <label className="block text-sm font-medium mb-1">{t('work.waysOfWorking.label')}</label>
            <textarea
              value={teamAPI.currentWork.waysOfWorking.join('\n')}
              onChange={(e) =>
                updateTeamAPI({
                  currentWork: {
                    ...teamAPI.currentWork,
                    waysOfWorking: e.target.value.split('\n').filter(Boolean),
                  },
                })
              }
              placeholder={t('work.waysOfWorking.placeholder')}
              rows={4}
              className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">{t('work.waysOfWorking.hint')}</p>
          </div>

          {/* Wider Improvements */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('work.widerImprovements.label')}
            </label>
            <textarea
              value={teamAPI.currentWork.widerImprovements.join('\n')}
              onChange={(e) =>
                updateTeamAPI({
                  currentWork: {
                    ...teamAPI.currentWork,
                    widerImprovements: e.target.value.split('\n').filter(Boolean),
                  },
                })
              }
              placeholder={t('work.widerImprovements.placeholder')}
              rows={4}
              className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">{t('work.widerImprovements.hint')}</p>
          </div>
        </div>
      )}

      {/* Interactions Tab */}
      {activeTab === 'interactions' && (
        <div className="space-y-6">
          {/* Current Interactions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">{t('interactions.current.title')}</h3>
              <button
                onClick={handleAddCurrentInteraction}
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={otherTeams.length === 0}
              >
                {t('addButton')}
              </button>
            </div>

            <div className="space-y-3">
              {teamAPI.currentInteractions.map((interaction) => {
                const otherTeam = getTeamById(interaction.teamId);
                const modeInfo = INTERACTION_MODES[interaction.interactionMode];
                return (
                  <div key={interaction.id} className="p-3 border rounded space-y-2">
                    <select
                      value={interaction.teamId}
                      onChange={(e) =>
                        handleUpdateCurrentInteraction(interaction.id, { teamId: e.target.value })
                      }
                      className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">{t('interactions.selectTeam')}</option>
                      {otherTeams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={interaction.interactionMode}
                      onChange={(e) =>
                        handleUpdateCurrentInteraction(interaction.id, {
                          interactionMode: e.target.value as InteractionMode,
                        })
                      }
                      className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.values(INTERACTION_MODES).map((mode) => (
                        <option key={mode.mode} value={mode.mode}>
                          {tModes(mode.mode)}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={interaction.purpose}
                      onChange={(e) =>
                        handleUpdateCurrentInteraction(interaction.id, { purpose: e.target.value })
                      }
                      placeholder={t('interactions.purposePlaceholder')}
                      className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                      type="text"
                      value={interaction.duration || ''}
                      onChange={(e) =>
                        handleUpdateCurrentInteraction(interaction.id, { duration: e.target.value })
                      }
                      placeholder={t('interactions.durationPlaceholder')}
                      className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                      onClick={() => handleDeleteCurrentInteraction(interaction.id)}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      {t('deleteButton')}
                    </button>
                  </div>
                );
              })}

              {teamAPI.currentInteractions.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">
                  {t('interactions.current.empty')}
                </p>
              )}
            </div>
          </div>

          {/* Planned Interactions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">{t('interactions.planned.title')}</h3>
              <button
                onClick={handleAddPlannedInteraction}
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={otherTeams.length === 0}
              >
                {t('addButton')}
              </button>
            </div>

            <div className="space-y-3">
              {teamAPI.plannedInteractions.map((interaction) => {
                const otherTeam = getTeamById(interaction.teamId);
                return (
                  <div key={interaction.id} className="p-3 border rounded space-y-2 bg-blue-50">
                    <select
                      value={interaction.teamId}
                      onChange={(e) =>
                        handleUpdatePlannedInteraction(interaction.id, { teamId: e.target.value })
                      }
                      className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">{t('interactions.selectTeam')}</option>
                      {otherTeams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={interaction.interactionMode}
                      onChange={(e) =>
                        handleUpdatePlannedInteraction(interaction.id, {
                          interactionMode: e.target.value as InteractionMode,
                        })
                      }
                      className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.values(INTERACTION_MODES).map((mode) => (
                        <option key={mode.mode} value={mode.mode}>
                          {tModes(mode.mode)}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={interaction.purpose}
                      onChange={(e) =>
                        handleUpdatePlannedInteraction(interaction.id, { purpose: e.target.value })
                      }
                      placeholder={t('interactions.purposePlaceholder')}
                      className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                      type="text"
                      value={interaction.duration || ''}
                      onChange={(e) =>
                        handleUpdatePlannedInteraction(interaction.id, { duration: e.target.value })
                      }
                      placeholder={t('interactions.durationPlaceholder')}
                      className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                      onClick={() => handleDeletePlannedInteraction(interaction.id)}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      {t('deleteButton')}
                    </button>
                  </div>
                );
              })}

              {teamAPI.plannedInteractions.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">
                  {t('interactions.planned.empty')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
