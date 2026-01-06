'use client';

import { useState, useEffect } from 'react';
import { useTopologyStore } from '@/store/topology-store';
import { TEAM_TYPES } from '@/lib/constants';
import { TeamType } from '@/types/team';
import { TeamApiSection } from './team-api-section';
import { CognitiveLoadSection } from './cognitive-load-section';

interface TeamPropertiesProps {
  teamId: string;
}

export function TeamProperties({ teamId }: TeamPropertiesProps) {
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
    return <div className="p-4 text-gray-500">Team not found</div>;
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
    if (confirm(`Are you sure you want to delete "${team.name}"?`)) {
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
          Basic Info
        </button>
        <button
          onClick={() => setActiveTab('team-api')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'team-api'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Team API
        </button>
        <button
          onClick={() => setActiveTab('cognitive-load')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'cognitive-load'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Cognitive Load
        </button>
      </div>

      {/* Basic Info Tab */}
      {activeTab === 'basic' && (
        <div className="space-y-6">
          {/* Team Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Team Type</label>
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
                    <span className="text-sm font-medium">{type.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium mb-1">Team Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleSave}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSave}
              rows={3}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Member Count</label>
            <input
              type="number"
              value={memberCount}
              onChange={(e) => setMemberCount(e.target.value)}
              onBlur={handleSave}
              min="1"
              max="20"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Recommended: 5-9 members</p>
          </div>

          {/* Organization Info */}
          <div>
            <label className="block text-sm font-medium mb-1">Tech Stack</label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              onBlur={handleSave}
              placeholder="TypeScript, React, Node.js"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated values</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Responsibilities</label>
            <input
              type="text"
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              onBlur={handleSave}
              placeholder="Payment API, Billing System"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated values</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              onBlur={handleSave}
              placeholder="critical, customer-facing"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated values</p>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t">
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Delete Team
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
