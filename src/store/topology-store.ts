/**
 * Team Topologies Designer - Zustand Store
 *
 * This store manages the application state including teams, interactions,
 * and topology metadata.
 */

import { create } from 'zustand';
import { Team, Interaction, Topology, TopologyMetadata, TeamType, InteractionMode } from '@/types/team';
import { generateId, formatDate } from '@/lib/utils';
import { TOPOLOGY_VERSION, NODE_SIZE } from '@/lib/constants';

interface TopologyStore {
  // State
  teams: Team[];
  interactions: Interaction[];
  metadata: TopologyMetadata;
  selectedTeamId: string | null;
  selectedInteractionId: string | null;
  filteredTeamIds: string[] | null; // null means no filter (show all)

  // Team actions
  addTeam: (type: TeamType, position: { x: number; y: number }) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  selectTeam: (id: string | null) => void;

  // Interaction actions
  addInteraction: (sourceId: string, targetId: string, mode: InteractionMode) => void;
  updateInteraction: (id: string, updates: Partial<Interaction>) => void;
  deleteInteraction: (id: string) => void;
  selectInteraction: (id: string | null) => void;

  // Topology actions
  loadTopology: (topology: Topology) => void;
  resetTopology: () => void;
  updateMetadata: (updates: Partial<TopologyMetadata>) => void;
  getTopology: () => Topology;

  // Filter actions
  setFilteredTeamIds: (ids: string[] | null) => void;

  // Utility
  getTeamById: (id: string) => Team | undefined;
  getInteractionById: (id: string) => Interaction | undefined;
}

const createDefaultMetadata = (): TopologyMetadata => ({
  name: 'New Topology',
  description: '',
  author: '',
  createdAt: formatDate(),
  updatedAt: formatDate(),
});

const createDefaultTeam = (type: TeamType, position: { x: number; y: number }): Team => ({
  id: generateId('team'),
  name: `New ${type} Team`,
  type,
  description: '',
  teamAPI: {
    codeRepositories: [],
    providedServices: [],
    dependencies: [],
  },
  memberCount: 7,
  techStack: [],
  responsibilities: [],
  tags: [],
  position,
  size: {
    width: NODE_SIZE.DEFAULT_WIDTH,
    height: NODE_SIZE.DEFAULT_HEIGHT,
  },
});

export const useTopologyStore = create<TopologyStore>((set, get) => ({
  // Initial state
  teams: [],
  interactions: [],
  metadata: createDefaultMetadata(),
  selectedTeamId: null,
  selectedInteractionId: null,
  filteredTeamIds: null,

  // Team actions
  addTeam: (type, position) => {
    const newTeam = createDefaultTeam(type, position);
    set((state) => ({
      teams: [...state.teams, newTeam],
      metadata: { ...state.metadata, updatedAt: formatDate() },
    }));
  },

  updateTeam: (id, updates) => {
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === id ? { ...team, ...updates } : team
      ),
      metadata: { ...state.metadata, updatedAt: formatDate() },
    }));
  },

  deleteTeam: (id) => {
    set((state) => ({
      teams: state.teams.filter((team) => team.id !== id),
      interactions: state.interactions.filter(
        (interaction) =>
          interaction.sourceTeamId !== id && interaction.targetTeamId !== id
      ),
      selectedTeamId: state.selectedTeamId === id ? null : state.selectedTeamId,
      metadata: { ...state.metadata, updatedAt: formatDate() },
    }));
  },

  selectTeam: (id) => {
    set({ selectedTeamId: id, selectedInteractionId: null });
  },

  // Interaction actions
  addInteraction: (sourceId, targetId, mode) => {
    const newInteraction: Interaction = {
      id: generateId('interaction'),
      sourceTeamId: sourceId,
      targetTeamId: targetId,
      mode,
    };
    set((state) => ({
      interactions: [...state.interactions, newInteraction],
      metadata: { ...state.metadata, updatedAt: formatDate() },
    }));
  },

  updateInteraction: (id, updates) => {
    set((state) => ({
      interactions: state.interactions.map((interaction) =>
        interaction.id === id ? { ...interaction, ...updates } : interaction
      ),
      metadata: { ...state.metadata, updatedAt: formatDate() },
    }));
  },

  deleteInteraction: (id) => {
    set((state) => ({
      interactions: state.interactions.filter((interaction) => interaction.id !== id),
      selectedInteractionId: state.selectedInteractionId === id ? null : state.selectedInteractionId,
      metadata: { ...state.metadata, updatedAt: formatDate() },
    }));
  },

  selectInteraction: (id) => {
    set({ selectedInteractionId: id, selectedTeamId: null });
  },

  // Topology actions
  loadTopology: (topology) => {
    set({
      teams: topology.teams,
      interactions: topology.interactions,
      metadata: topology.metadata,
      selectedTeamId: null,
      selectedInteractionId: null,
      filteredTeamIds: null,
    });
  },

  resetTopology: () => {
    set({
      teams: [],
      interactions: [],
      metadata: createDefaultMetadata(),
      selectedTeamId: null,
      selectedInteractionId: null,
      filteredTeamIds: null,
    });
  },

  updateMetadata: (updates) => {
    set((state) => ({
      metadata: { ...state.metadata, ...updates, updatedAt: formatDate() },
    }));
  },

  getTopology: () => {
    const state = get();
    return {
      version: TOPOLOGY_VERSION,
      metadata: state.metadata,
      teams: state.teams,
      interactions: state.interactions,
    };
  },

  // Filter actions
  setFilteredTeamIds: (ids) => {
    set({ filteredTeamIds: ids });
  },

  // Utility
  getTeamById: (id) => {
    return get().teams.find((team) => team.id === id);
  },

  getInteractionById: (id) => {
    return get().interactions.find((interaction) => interaction.id === id);
  },
}));
