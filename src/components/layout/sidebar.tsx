'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { TEAM_TYPES } from '@/lib/constants';
import { TeamType } from '@/types/team';
import { useTopologyStore } from '@/store/topology-store';

export function Sidebar() {
  const t = useTranslations('sidebar');
  const tTypes = useTranslations('teamTypes');
  const teamTypes = Object.values(TEAM_TYPES);
  const { teams, selectTeam, setFilteredTeamIds } = useTopologyStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilters, setSelectedTypeFilters] = useState<Set<TeamType>>(new Set());
  const [selectedTagFilter, setSelectedTagFilter] = useState('');

  const handleDragStart = (e: React.DragEvent, type: TeamType) => {
    e.dataTransfer.setData('application/team-type', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleTeamClick = (teamId: string) => {
    selectTeam(teamId);
  };

  const toggleTypeFilter = (type: TeamType) => {
    const newFilters = new Set(selectedTypeFilters);
    if (newFilters.has(type)) {
      newFilters.delete(type);
    } else {
      newFilters.add(type);
    }
    setSelectedTypeFilters(newFilters);
  };

  // Get all unique tags from teams
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    teams.forEach((team) => {
      team.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [teams]);

  // Filter teams based on search query, type filters, and tag filter
  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = team.name.toLowerCase().includes(query);
        const matchesDescription = team.description?.toLowerCase().includes(query);
        const matchesTechStack = team.techStack?.some((tech) =>
          tech.toLowerCase().includes(query)
        );
        const matchesResponsibilities = team.responsibilities?.some((resp) =>
          resp.toLowerCase().includes(query)
        );

        if (!matchesName && !matchesDescription && !matchesTechStack && !matchesResponsibilities) {
          return false;
        }
      }

      // Type filter
      if (selectedTypeFilters.size > 0 && !selectedTypeFilters.has(team.type)) {
        return false;
      }

      // Tag filter
      if (selectedTagFilter && !team.tags?.includes(selectedTagFilter)) {
        return false;
      }

      return true;
    });
  }, [teams, searchQuery, selectedTypeFilters, selectedTagFilter]);

  // Update filtered team IDs in store when filters change
  useEffect(() => {
    const hasActiveFilters = searchQuery || selectedTypeFilters.size > 0 || selectedTagFilter;
    if (hasActiveFilters) {
      setFilteredTeamIds(filteredTeams.map((t) => t.id));
    } else {
      setFilteredTeamIds(null); // null means no filter (show all normally)
    }
  }, [filteredTeams, searchQuery, selectedTypeFilters.size, selectedTagFilter, setFilteredTeamIds]);

  return (
    <aside className="w-64 border-r bg-gray-50 overflow-y-auto flex flex-col">
      <div className="p-4 space-y-6 flex-1">
        {/* Team Types Section */}
        <div>
          <h2 className="text-sm font-semibold mb-3 text-gray-700">{t('teamTypes')}</h2>
          <p className="text-xs text-gray-500 mb-3">{t('dragToCanvas')}</p>
          <div className="space-y-2">
            {teamTypes.map((teamType) => (
              <div
                key={teamType.type}
                draggable
                onDragStart={(e) => handleDragStart(e, teamType.type)}
                className="p-3 rounded border-2 cursor-move hover:shadow-md transition-shadow"
                style={{
                  borderColor: teamType.color,
                  backgroundColor: `${teamType.color}10`,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: teamType.color }}
                  />
                  <span className="font-medium text-sm">{tTypes(teamType.type)}</span>
                </div>
                <p className="text-xs text-gray-600">{tTypes(`${teamType.type}Desc`)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search & Filter Section */}
        {teams.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-700">
              {t('searchAndFilter')}
            </h2>

            {/* Search input */}
            <div>
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Type filters */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">{t('filterByType')}</p>
              <div className="space-y-1">
                {teamTypes.map((teamType) => (
                  <label
                    key={teamType.type}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypeFilters.has(teamType.type)}
                      onChange={() => toggleTypeFilter(teamType.type)}
                      className="w-3.5 h-3.5"
                    />
                    <div
                      className="w-2.5 h-2.5 rounded"
                      style={{ backgroundColor: teamType.color }}
                    />
                    <span className="text-xs">{tTypes(teamType.type)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tag filter */}
            {allTags.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-600 mb-2">{t('filterByTag')}</p>
                <select
                  value={selectedTagFilter}
                  onChange={(e) => setSelectedTagFilter(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t('selectTag')}</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Clear filters button */}
            {(searchQuery || selectedTypeFilters.size > 0 || selectedTagFilter) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTypeFilters(new Set());
                  setSelectedTagFilter('');
                }}
                className="w-full px-3 py-1.5 text-xs bg-gray-200 hover:bg-gray-300 rounded"
              >
                {t('clearFilters')}
              </button>
            )}
          </div>
        )}

        {/* Teams List */}
        {teams.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold mb-3 text-gray-700">
              {t('teams')} ({filteredTeams.length}/{teams.length})
            </h2>
            <div className="space-y-1">
              {filteredTeams.length > 0 ? (
                filteredTeams.map((team) => {
                  const teamTypeInfo = TEAM_TYPES[team.type];
                  return (
                    <button
                      key={team.id}
                      onClick={() => handleTeamClick(team.id)}
                      className="w-full text-left p-2 rounded hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                      <div
                        className="w-3 h-3 rounded flex-shrink-0"
                        style={{ backgroundColor: teamTypeInfo.color }}
                      />
                      <span className="text-sm truncate">{team.name}</span>
                    </button>
                  );
                })
              ) : (
                <p className="text-xs text-gray-400 text-center py-4">
                  {t('teamsCount', { count: 0 })}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
