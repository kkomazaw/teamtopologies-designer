import JSZip from 'jszip';
import Papa from 'papaparse';
import { Team, Interaction, Service, Repository, Dependency, Topology } from '@/types/team';
import { generateId } from './utils';

interface ImportResult {
  success: boolean;
  topology?: Topology;
  errors: string[];
  warnings: string[];
}

interface CSVRow {
  [key: string]: string;
}

/**
 * Import topology from CSV ZIP file
 */
export async function importFromCSVZip(
  file: File,
  mode: 'replace' | 'merge' = 'replace'
): Promise<ImportResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Extract ZIP file
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(file);

    // Read CSV files
    const teamsFile = zipContent.file('teams.csv');
    const servicesFile = zipContent.file('services.csv');
    const dependenciesFile = zipContent.file('dependencies.csv');
    const interactionsFile = zipContent.file('interactions.csv');
    const repositoriesFile = zipContent.file('repositories.csv');

    if (!teamsFile) {
      errors.push('teams.csv is missing from the ZIP file');
      return { success: false, errors, warnings };
    }

    // Parse teams.csv
    const teamsCSV = await teamsFile.async('text');
    const teamsParsed = Papa.parse<CSVRow>(teamsCSV, { header: true, skipEmptyLines: true });

    if (teamsParsed.errors.length > 0) {
      errors.push(`teams.csv parsing errors: ${teamsParsed.errors.map(e => e.message).join(', ')}`);
    }

    // Parse services.csv
    let servicesParsed: Papa.ParseResult<CSVRow> | null = null;
    if (servicesFile) {
      const servicesCSV = await servicesFile.async('text');
      servicesParsed = Papa.parse<CSVRow>(servicesCSV, { header: true, skipEmptyLines: true });
      if (servicesParsed.errors.length > 0) {
        warnings.push(`services.csv parsing warnings: ${servicesParsed.errors.map(e => e.message).join(', ')}`);
      }
    }

    // Parse dependencies.csv
    let dependenciesParsed: Papa.ParseResult<CSVRow> | null = null;
    if (dependenciesFile) {
      const dependenciesCSV = await dependenciesFile.async('text');
      dependenciesParsed = Papa.parse<CSVRow>(dependenciesCSV, { header: true, skipEmptyLines: true });
      if (dependenciesParsed.errors.length > 0) {
        warnings.push(`dependencies.csv parsing warnings: ${dependenciesParsed.errors.map(e => e.message).join(', ')}`);
      }
    }

    // Parse interactions.csv
    let interactionsParsed: Papa.ParseResult<CSVRow> | null = null;
    if (interactionsFile) {
      const interactionsCSV = await interactionsFile.async('text');
      interactionsParsed = Papa.parse<CSVRow>(interactionsCSV, { header: true, skipEmptyLines: true });
      if (interactionsParsed.errors.length > 0) {
        warnings.push(`interactions.csv parsing warnings: ${interactionsParsed.errors.map(e => e.message).join(', ')}`);
      }
    }

    // Parse repositories.csv
    let repositoriesParsed: Papa.ParseResult<CSVRow> | null = null;
    if (repositoriesFile) {
      const repositoriesCSV = await repositoriesFile.async('text');
      repositoriesParsed = Papa.parse<CSVRow>(repositoriesCSV, { header: true, skipEmptyLines: true });
      if (repositoriesParsed.errors.length > 0) {
        warnings.push(`repositories.csv parsing warnings: ${repositoriesParsed.errors.map(e => e.message).join(', ')}`);
      }
    }

    // Build topology
    const teams: Team[] = [];
    const teamIdMap = new Map<string, string>(); // Old ID -> New ID

    // Process teams
    for (const row of teamsParsed.data) {
      if (!row.id || !row.name || !row.type) {
        warnings.push(`Skipping team row with missing required fields: ${JSON.stringify(row)}`);
        continue;
      }

      const newId = generateId('team');
      teamIdMap.set(row.id, newId);

      const team: Team = {
        id: newId,
        name: row.name,
        type: row.type as any,
        description: row.description || '',
        teamAPI: {
          codeRepositories: [],
          providedServices: [],
          dependencies: [],
          versioning: row.versioning || undefined,
          performance: row.slo || row.sli ? {
            slo: row.slo || undefined,
            sli: row.sli || undefined,
          } : undefined,
        },
        memberCount: row.memberCount ? parseInt(row.memberCount) : undefined,
        techStack: row.techStack ? row.techStack.split(',').map(s => s.trim()).filter(Boolean) : [],
        responsibilities: row.responsibilities ? row.responsibilities.split(',').map(s => s.trim()).filter(Boolean) : [],
        tags: row.tags ? row.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
        cognitiveLoad: row.cognitiveLoadDomain ? {
          domain: parseInt(row.cognitiveLoadDomain) || 5,
          technical: parseInt(row.cognitiveLoadTechnical) || 5,
          scope: parseInt(row.cognitiveLoadScope) || 5,
        } : undefined,
        position: {
          x: row.positionX ? parseFloat(row.positionX) : 0,
          y: row.positionY ? parseFloat(row.positionY) : 0,
        },
        size: row.sizeWidth && row.sizeHeight ? {
          width: parseFloat(row.sizeWidth),
          height: parseFloat(row.sizeHeight),
        } : undefined,
      };

      teams.push(team);
    }

    // Process services
    if (servicesParsed) {
      for (const row of servicesParsed.data) {
        if (!row.id || !row.teamId || !row.name) {
          warnings.push(`Skipping service row with missing required fields: ${JSON.stringify(row)}`);
          continue;
        }

        const newTeamId = teamIdMap.get(row.teamId);
        if (!newTeamId) {
          warnings.push(`Service references unknown team ID: ${row.teamId}`);
          continue;
        }

        const team = teams.find(t => t.id === newTeamId);
        if (team) {
          const service: Service = {
            id: generateId('service'),
            name: row.name,
            description: row.description || undefined,
            version: row.version || undefined,
            endpoint: row.endpoint || undefined,
            slo: row.slo || undefined,
            sli: row.sli || undefined,
          };
          team.teamAPI.providedServices.push(service);
        }
      }
    }

    // Process repositories
    if (repositoriesParsed) {
      for (const row of repositoriesParsed.data) {
        if (!row.id || !row.teamId || !row.name) {
          warnings.push(`Skipping repository row with missing required fields: ${JSON.stringify(row)}`);
          continue;
        }

        const newTeamId = teamIdMap.get(row.teamId);
        if (!newTeamId) {
          warnings.push(`Repository references unknown team ID: ${row.teamId}`);
          continue;
        }

        const team = teams.find(t => t.id === newTeamId);
        if (team) {
          const repo: Repository = {
            id: generateId('repo'),
            name: row.name,
            url: row.url || undefined,
            description: row.description || undefined,
            primaryLanguage: row.primaryLanguage || undefined,
          };
          team.teamAPI.codeRepositories.push(repo);
        }
      }
    }

    // Process dependencies
    if (dependenciesParsed) {
      for (const row of dependenciesParsed.data) {
        if (!row.id || !row.consumerTeamId || !row.providerTeamId) {
          warnings.push(`Skipping dependency row with missing required fields: ${JSON.stringify(row)}`);
          continue;
        }

        const newConsumerTeamId = teamIdMap.get(row.consumerTeamId);
        const newProviderTeamId = teamIdMap.get(row.providerTeamId);

        if (!newConsumerTeamId || !newProviderTeamId) {
          warnings.push(`Dependency references unknown team IDs: consumer=${row.consumerTeamId}, provider=${row.providerTeamId}`);
          continue;
        }

        const team = teams.find(t => t.id === newConsumerTeamId);
        if (team) {
          const dependency: Dependency = {
            id: generateId('dep'),
            providerTeamId: newProviderTeamId,
            serviceId: row.serviceId || undefined,
            description: row.description || undefined,
            criticality: row.criticality as any || undefined,
          };
          team.teamAPI.dependencies.push(dependency);
        }
      }
    }

    // Process interactions
    const interactions: Interaction[] = [];
    if (interactionsParsed) {
      for (const row of interactionsParsed.data) {
        if (!row.id || !row.sourceTeamId || !row.targetTeamId || !row.mode) {
          warnings.push(`Skipping interaction row with missing required fields: ${JSON.stringify(row)}`);
          continue;
        }

        const newSourceTeamId = teamIdMap.get(row.sourceTeamId);
        const newTargetTeamId = teamIdMap.get(row.targetTeamId);

        if (!newSourceTeamId || !newTargetTeamId) {
          warnings.push(`Interaction references unknown team IDs: source=${row.sourceTeamId}, target=${row.targetTeamId}`);
          continue;
        }

        const interaction: Interaction = {
          id: generateId('interaction'),
          sourceTeamId: newSourceTeamId,
          targetTeamId: newTargetTeamId,
          mode: row.mode as any,
          description: row.description || undefined,
          label: row.label || undefined,
        };
        interactions.push(interaction);
      }
    }

    // Validate teams
    const validationErrors = validateTopology({ teams, interactions });
    if (validationErrors.length > 0) {
      errors.push(...validationErrors);
    }

    if (errors.length > 0) {
      return { success: false, errors, warnings };
    }

    const topology: Topology = {
      version: '1.0.0',
      metadata: {
        name: 'Imported Topology',
        description: 'Imported from CSV ZIP',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      teams,
      interactions,
    };

    return { success: true, topology, errors, warnings };
  } catch (error) {
    errors.push(`Import failed: ${error instanceof Error ? error.message : String(error)}`);
    return { success: false, errors, warnings };
  }
}

/**
 * Validate topology data
 */
function validateTopology(data: { teams: Team[]; interactions: Interaction[] }): string[] {
  const errors: string[] = [];

  // Validate teams
  const teamIds = new Set<string>();
  for (const team of data.teams) {
    if (!team.id || !team.name || !team.type) {
      errors.push(`Team missing required fields: ${JSON.stringify(team)}`);
    }
    if (teamIds.has(team.id)) {
      errors.push(`Duplicate team ID: ${team.id}`);
    }
    teamIds.add(team.id);

    // Validate team type
    const validTypes = ['stream-aligned', 'enabling', 'complicated-subsystem', 'platform'];
    if (!validTypes.includes(team.type)) {
      errors.push(`Invalid team type: ${team.type} for team ${team.name}`);
    }
  }

  // Validate interactions
  for (const interaction of data.interactions) {
    if (!teamIds.has(interaction.sourceTeamId)) {
      errors.push(`Interaction references non-existent source team: ${interaction.sourceTeamId}`);
    }
    if (!teamIds.has(interaction.targetTeamId)) {
      errors.push(`Interaction references non-existent target team: ${interaction.targetTeamId}`);
    }

    // Validate interaction mode
    const validModes = ['collaboration', 'x-as-a-service', 'facilitating'];
    if (!validModes.includes(interaction.mode)) {
      errors.push(`Invalid interaction mode: ${interaction.mode}`);
    }
  }

  return errors;
}
