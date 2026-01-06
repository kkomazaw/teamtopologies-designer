/**
 * Team Topologies Designer - Constants
 *
 * This file contains constant values used throughout the application,
 * including team type and interaction mode definitions.
 */

import { TeamTypeInfo, InteractionModeInfo } from '@/types/team';

// Team Type definitions
export const TEAM_TYPES: Record<string, TeamTypeInfo> = {
  'stream-aligned': {
    type: 'stream-aligned',
    label: 'Stream-Aligned',
    color: '#3B82F6',
    description: 'Aligned to a flow of work from a segment of the business',
  },
  'enabling': {
    type: 'enabling',
    label: 'Enabling',
    color: '#10B981',
    description: 'Helps other teams overcome obstacles and increase capabilities',
  },
  'complicated-subsystem': {
    type: 'complicated-subsystem',
    label: 'Complicated-Subsystem',
    color: '#8B5CF6',
    description: 'Responsible for building and maintaining complex subsystems',
  },
  'platform': {
    type: 'platform',
    label: 'Platform',
    color: '#F59E0B',
    description: 'Provides internal services to reduce cognitive load of other teams',
  },
};

// Interaction Mode definitions
export const INTERACTION_MODES: Record<string, InteractionModeInfo> = {
  'collaboration': {
    mode: 'collaboration',
    label: 'Collaboration',
    color: '#6B7280',
    description: 'Two teams work closely together for a defined period',
    strokeStyle: 'solid',
    animated: false,
  },
  'x-as-a-service': {
    mode: 'x-as-a-service',
    label: 'X-as-a-Service',
    color: '#3B82F6',
    description: 'One team provides a service with a clear API',
    strokeStyle: 'solid',
    animated: true,
  },
  'facilitating': {
    mode: 'facilitating',
    label: 'Facilitating',
    color: '#10B981',
    description: 'One team helps another team to adopt new practices',
    strokeStyle: 'dashed',
    animated: false,
  },
};

// Default topology version
export const TOPOLOGY_VERSION = '1.0.0';

// Default team size (recommended by Team Topologies)
export const DEFAULT_TEAM_SIZE = {
  MIN: 5,
  MAX: 9,
  RECOMMENDED: 7,
};

// Local storage keys
export const STORAGE_KEYS = {
  TOPOLOGY: 'teamtopologies-designer-topology',
  AUTOSAVE: 'teamtopologies-designer-autosave',
};

// Canvas settings
export const CANVAS_SETTINGS = {
  DEFAULT_ZOOM: 1,
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 2,
  GRID_SIZE: 20,
};

// Node size defaults
export const NODE_SIZE = {
  DEFAULT_WIDTH: 200,
  DEFAULT_HEIGHT: 100,
  MIN_WIDTH: 150,
  MIN_HEIGHT: 80,
};

// Cognitive load scale
export const COGNITIVE_LOAD_SCALE = {
  MIN: 1,
  MAX: 10,
  LOW_THRESHOLD: 3,
  HIGH_THRESHOLD: 7,
};
