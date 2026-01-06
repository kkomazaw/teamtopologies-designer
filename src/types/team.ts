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

// Team Interaction - based on official Team API template
// Represents how this team interacts with another team
export interface TeamInteraction {
  id: string;
  teamId: string; // Reference to the other team
  interactionMode: InteractionMode;
  purpose: string;
  duration?: string; // e.g., "ongoing", "3 months", "until Q2"
}

// Current work - based on official Team API template
export interface CurrentWork {
  servicesAndSystems: string[]; // What services/systems the team is working on
  waysOfWorking: string[]; // Improvements to how the team works
  widerImprovements: string[]; // Cross-team or organizational improvements
}

// Team API information - based on official Team API template
// See: https://github.com/TeamTopologies/Team-API-template
export interface TeamAPI {
  // Basic information
  focus?: string; // Team's focus area

  // Platform and service details
  partOfPlatform: {
    isPart: boolean;
    details?: string;
  };

  providesServiceToOtherTeams: {
    provides: boolean;
    details?: string;
  };

  serviceLevelExpectations?: string;

  // Software and versioning
  softwareOwned: string[]; // Software owned and evolved by this team
  versioningApproaches?: string;

  // Communication and collaboration
  wikiSearchTerms: string[]; // Keywords for finding team info
  chatChannels: string[]; // e.g., #team-payments, #platform-team
  dailySyncTime?: string; // e.g., "10:00 UTC", "9:30 JST"

  // Current work
  currentWork: CurrentWork;

  // Team interactions
  currentInteractions: TeamInteraction[]; // Teams we currently interact with
  plannedInteractions: TeamInteraction[]; // Teams we expect to interact with soon
}

// Legacy types - kept for backward compatibility
// These will be migrated to the new TeamAPI structure
/** @deprecated Use TeamAPI.softwareOwned instead */
export interface Service {
  id: string;
  name: string;
  description?: string;
  version?: string;
  endpoint?: string;
  slo?: string;
  sli?: string;
}

/** @deprecated Use TeamInteraction instead */
export interface Dependency {
  id: string;
  providerTeamId: string;
  serviceId?: string;
  description?: string;
  criticality?: 'low' | 'medium' | 'high' | 'critical';
}

/** @deprecated Use TeamAPI.softwareOwned instead */
export interface Repository {
  id: string;
  name: string;
  url?: string;
  description?: string;
  primaryLanguage?: string;
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
