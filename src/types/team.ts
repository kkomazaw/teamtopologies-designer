/**
 * Team Topologies Designer - Type Definitions
 *
 * This file contains all the TypeScript type definitions for the application,
 * based on the Team Topologies framework.
 */

// Team Types as defined in Team Topologies
export type TeamType =
  | 'stream-aligned'
  | 'enabling'
  | 'complicated-subsystem'
  | 'platform';

// Interaction Modes between teams
export type InteractionMode =
  | 'collaboration'
  | 'x-as-a-service'
  | 'facilitating';

// Service provided by a team (Team API)
export interface Service {
  id: string;
  name: string;
  description?: string;
  version?: string;
  endpoint?: string;
  slo?: string; // Service Level Objective
  sli?: string; // Service Level Indicator
}

// Dependency on another team's service
export interface Dependency {
  id: string;
  providerTeamId: string;
  serviceId?: string;
  description?: string;
  criticality?: 'low' | 'medium' | 'high' | 'critical';
}

// Repository managed by a team
export interface Repository {
  id: string;
  name: string;
  url?: string;
  description?: string;
  primaryLanguage?: string;
}

// Team API information
export interface TeamAPI {
  codeRepositories: Repository[];
  providedServices: Service[];
  dependencies: Dependency[];
  versioning?: string;
  performance?: {
    slo?: string;
    sli?: string;
  };
}

// Cognitive Load indicators (optional)
export interface CognitiveLoad {
  domain: number;      // 1-10: Domain complexity
  technical: number;   // 1-10: Technical complexity
  scope: number;       // 1-10: Breadth of responsibility
}

// Position on the canvas
export interface Position {
  x: number;
  y: number;
}

// Size of the team node
export interface Size {
  width: number;
  height: number;
}

// Team entity
export interface Team {
  id: string;
  name: string;
  type: TeamType;
  description: string;

  // Team API
  teamAPI: TeamAPI;

  // Organization info
  memberCount?: number;
  techStack: string[];
  responsibilities: string[];
  tags: string[];

  // Cognitive load (optional)
  cognitiveLoad?: CognitiveLoad;

  // Visual positioning
  position: Position;
  size?: Size;
}

// Interaction between teams
export interface Interaction {
  id: string;
  sourceTeamId: string;
  targetTeamId: string;
  mode: InteractionMode;
  description?: string;
  label?: string;
}

// Metadata for the topology
export interface TopologyMetadata {
  name: string;
  description: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
}

// Root topology object
export interface Topology {
  version: string;
  metadata: TopologyMetadata;
  teams: Team[];
  interactions: Interaction[];
}

// Team type metadata for UI
export interface TeamTypeInfo {
  type: TeamType;
  label: string;
  color: string;
  description: string;
}

// Interaction mode metadata for UI
export interface InteractionModeInfo {
  mode: InteractionMode;
  label: string;
  color: string;
  description: string;
  strokeStyle: 'solid' | 'dashed';
  animated: boolean;
}
