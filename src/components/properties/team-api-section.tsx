'use client';

import { useState } from 'react';
import { useTopologyStore } from '@/store/topology-store';
import { Service, Repository, Dependency } from '@/types/team';
import { generateId } from '@/lib/utils';

interface TeamApiSectionProps {
  teamId: string;
}

export function TeamApiSection({ teamId }: TeamApiSectionProps) {
  const { getTeamById, updateTeam, teams } = useTopologyStore();
  const team = getTeamById(teamId);

  const [activeTab, setActiveTab] = useState<'services' | 'dependencies' | 'repositories'>('services');

  if (!team) return null;

  const handleAddService = () => {
    const newService: Service = {
      id: generateId('service'),
      name: 'New Service',
      description: '',
    };
    updateTeam(teamId, {
      teamAPI: {
        ...team.teamAPI,
        providedServices: [...team.teamAPI.providedServices, newService],
      },
    });
  };

  const handleUpdateService = (serviceId: string, updates: Partial<Service>) => {
    const updatedServices = team.teamAPI.providedServices.map((service) =>
      service.id === serviceId ? { ...service, ...updates } : service
    );
    updateTeam(teamId, {
      teamAPI: { ...team.teamAPI, providedServices: updatedServices },
    });
  };

  const handleDeleteService = (serviceId: string) => {
    const updatedServices = team.teamAPI.providedServices.filter((s) => s.id !== serviceId);
    updateTeam(teamId, {
      teamAPI: { ...team.teamAPI, providedServices: updatedServices },
    });
  };

  const handleAddRepository = () => {
    const newRepo: Repository = {
      id: generateId('repo'),
      name: 'New Repository',
    };
    updateTeam(teamId, {
      teamAPI: {
        ...team.teamAPI,
        codeRepositories: [...team.teamAPI.codeRepositories, newRepo],
      },
    });
  };

  const handleUpdateRepository = (repoId: string, updates: Partial<Repository>) => {
    const updatedRepos = team.teamAPI.codeRepositories.map((repo) =>
      repo.id === repoId ? { ...repo, ...updates } : repo
    );
    updateTeam(teamId, {
      teamAPI: { ...team.teamAPI, codeRepositories: updatedRepos },
    });
  };

  const handleDeleteRepository = (repoId: string) => {
    const updatedRepos = team.teamAPI.codeRepositories.filter((r) => r.id !== repoId);
    updateTeam(teamId, {
      teamAPI: { ...team.teamAPI, codeRepositories: updatedRepos },
    });
  };

  const handleAddDependency = () => {
    const newDep: Dependency = {
      id: generateId('dep'),
      providerTeamId: teams.find((t) => t.id !== teamId)?.id || '',
      description: '',
    };
    updateTeam(teamId, {
      teamAPI: {
        ...team.teamAPI,
        dependencies: [...team.teamAPI.dependencies, newDep],
      },
    });
  };

  const handleUpdateDependency = (depId: string, updates: Partial<Dependency>) => {
    const updatedDeps = team.teamAPI.dependencies.map((dep) =>
      dep.id === depId ? { ...dep, ...updates } : dep
    );
    updateTeam(teamId, {
      teamAPI: { ...team.teamAPI, dependencies: updatedDeps },
    });
  };

  const handleDeleteDependency = (depId: string) => {
    const updatedDeps = team.teamAPI.dependencies.filter((d) => d.id !== depId);
    updateTeam(teamId, {
      teamAPI: { ...team.teamAPI, dependencies: updatedDeps },
    });
  };

  const otherTeams = teams.filter((t) => t.id !== teamId);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'services'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Services ({team.teamAPI.providedServices.length})
        </button>
        <button
          onClick={() => setActiveTab('dependencies')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'dependencies'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Dependencies ({team.teamAPI.dependencies.length})
        </button>
        <button
          onClick={() => setActiveTab('repositories')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'repositories'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Repositories ({team.teamAPI.codeRepositories.length})
        </button>
      </div>

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Services provided by this team</p>
            <button
              onClick={handleAddService}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              + Add
            </button>
          </div>

          {team.teamAPI.providedServices.map((service) => (
            <div key={service.id} className="p-3 border rounded space-y-2">
              <input
                type="text"
                value={service.name}
                onChange={(e) => handleUpdateService(service.id, { name: e.target.value })}
                className="w-full font-medium px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Service name"
              />
              <input
                type="text"
                value={service.version || ''}
                onChange={(e) => handleUpdateService(service.id, { version: e.target.value })}
                className="w-full text-sm px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Version (e.g., v1.2.0)"
              />
              <input
                type="text"
                value={service.endpoint || ''}
                onChange={(e) => handleUpdateService(service.id, { endpoint: e.target.value })}
                className="w-full text-sm px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Endpoint (e.g., /api/v1/payments)"
              />
              <textarea
                value={service.description || ''}
                onChange={(e) => handleUpdateService(service.id, { description: e.target.value })}
                className="w-full text-sm px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Description"
                rows={2}
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={service.slo || ''}
                  onChange={(e) => handleUpdateService(service.id, { slo: e.target.value })}
                  className="text-sm px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="SLO"
                />
                <input
                  type="text"
                  value={service.sli || ''}
                  onChange={(e) => handleUpdateService(service.id, { sli: e.target.value })}
                  className="text-sm px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="SLI"
                />
              </div>
              <button
                onClick={() => handleDeleteService(service.id)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Delete Service
              </button>
            </div>
          ))}

          {team.teamAPI.providedServices.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No services yet</p>
          )}
        </div>
      )}

      {/* Dependencies Tab */}
      {activeTab === 'dependencies' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Dependencies on other teams</p>
            <button
              onClick={handleAddDependency}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={otherTeams.length === 0}
            >
              + Add
            </button>
          </div>

          {team.teamAPI.dependencies.map((dep) => {
            const providerTeam = getTeamById(dep.providerTeamId);
            return (
              <div key={dep.id} className="p-3 border rounded space-y-2">
                <select
                  value={dep.providerTeamId}
                  onChange={(e) => handleUpdateDependency(dep.id, { providerTeamId: e.target.value })}
                  className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select team...</option>
                  {otherTeams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>

                {providerTeam && providerTeam.teamAPI.providedServices.length > 0 && (
                  <select
                    value={dep.serviceId || ''}
                    onChange={(e) => handleUpdateDependency(dep.id, { serviceId: e.target.value })}
                    className="w-full text-sm px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select service (optional)...</option>
                    {providerTeam.teamAPI.providedServices.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                )}

                <select
                  value={dep.criticality || ''}
                  onChange={(e) => handleUpdateDependency(dep.id, { criticality: e.target.value as any })}
                  className="w-full text-sm px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Criticality...</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>

                <textarea
                  value={dep.description || ''}
                  onChange={(e) => handleUpdateDependency(dep.id, { description: e.target.value })}
                  className="w-full text-sm px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Description"
                  rows={2}
                />
                <button
                  onClick={() => handleDeleteDependency(dep.id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Delete Dependency
                </button>
              </div>
            );
          })}

          {team.teamAPI.dependencies.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No dependencies yet</p>
          )}
        </div>
      )}

      {/* Repositories Tab */}
      {activeTab === 'repositories' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Code repositories</p>
            <button
              onClick={handleAddRepository}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              + Add
            </button>
          </div>

          {team.teamAPI.codeRepositories.map((repo) => (
            <div key={repo.id} className="p-3 border rounded space-y-2">
              <input
                type="text"
                value={repo.name}
                onChange={(e) => handleUpdateRepository(repo.id, { name: e.target.value })}
                className="w-full font-medium px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Repository name"
              />
              <input
                type="text"
                value={repo.url || ''}
                onChange={(e) => handleUpdateRepository(repo.id, { url: e.target.value })}
                className="w-full text-sm px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="URL (e.g., https://github.com/org/repo)"
              />
              <input
                type="text"
                value={repo.primaryLanguage || ''}
                onChange={(e) => handleUpdateRepository(repo.id, { primaryLanguage: e.target.value })}
                className="w-full text-sm px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Primary language"
              />
              <textarea
                value={repo.description || ''}
                onChange={(e) => handleUpdateRepository(repo.id, { description: e.target.value })}
                className="w-full text-sm px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Description"
                rows={2}
              />
              <button
                onClick={() => handleDeleteRepository(repo.id)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Delete Repository
              </button>
            </div>
          ))}

          {team.teamAPI.codeRepositories.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No repositories yet</p>
          )}
        </div>
      )}
    </div>
  );
}
