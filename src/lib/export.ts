/**
 * Export utilities for Team Topologies Designer
 */

import { saveAs } from 'file-saver';
import yaml from 'js-yaml';
import Papa from 'papaparse';
import JSZip from 'jszip';
import { Topology } from '@/types/team';
import { formatArrayString } from './utils';

/**
 * Export topology as JSON
 */
export function exportAsJSON(topology: Topology, filename: string) {
  const json = JSON.stringify(topology, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  saveAs(blob, `${filename}.json`);
}

/**
 * Export topology as YAML
 */
export function exportAsYAML(topology: Topology, filename: string) {
  const yamlStr = yaml.dump(topology);
  const blob = new Blob([yamlStr], { type: 'text/yaml;charset=utf-8' });
  saveAs(blob, `${filename}.yaml`);
}

/**
 * Export topology as CSV files in a ZIP archive
 */
export async function exportAsCSV(topology: Topology, filename: string) {
  const zip = new JSZip();

  // 1. teams.csv
  const teamsData = topology.teams.map((team) => ({
    id: team.id,
    name: team.name,
    type: team.type,
    description: team.description,
    memberCount: team.memberCount || '',
    techStack: formatArrayString(team.techStack),
    responsibilities: formatArrayString(team.responsibilities),
    tags: formatArrayString(team.tags),
    cognitiveLoad_domain: team.cognitiveLoad?.domain || '',
    cognitiveLoad_technical: team.cognitiveLoad?.technical || '',
    cognitiveLoad_scope: team.cognitiveLoad?.scope || '',
    position_x: team.position.x,
    position_y: team.position.y,
  }));
  const teamsCsv = Papa.unparse(teamsData);
  zip.file('teams.csv', '\uFEFF' + teamsCsv); // Add BOM for Excel

  // 2. services.csv
  const servicesData: any[] = [];
  topology.teams.forEach((team) => {
    team.teamAPI.providedServices.forEach((service) => {
      servicesData.push({
        id: service.id,
        teamId: team.id,
        name: service.name,
        description: service.description || '',
        version: service.version || '',
        endpoint: service.endpoint || '',
        slo: service.slo || '',
        sli: service.sli || '',
      });
    });
  });
  const servicesCsv = Papa.unparse(servicesData);
  zip.file('services.csv', '\uFEFF' + servicesCsv);

  // 3. dependencies.csv
  const dependenciesData: any[] = [];
  topology.teams.forEach((team) => {
    team.teamAPI.dependencies.forEach((dep) => {
      dependenciesData.push({
        id: dep.id,
        consumerTeamId: team.id,
        providerTeamId: dep.providerTeamId,
        serviceId: dep.serviceId || '',
        description: dep.description || '',
        criticality: dep.criticality || '',
      });
    });
  });
  const dependenciesCsv = Papa.unparse(dependenciesData);
  zip.file('dependencies.csv', '\uFEFF' + dependenciesCsv);

  // 4. interactions.csv
  const interactionsData = topology.interactions.map((interaction) => ({
    id: interaction.id,
    sourceTeamId: interaction.sourceTeamId,
    targetTeamId: interaction.targetTeamId,
    mode: interaction.mode,
    description: interaction.description || '',
    label: interaction.label || '',
  }));
  const interactionsCsv = Papa.unparse(interactionsData);
  zip.file('interactions.csv', '\uFEFF' + interactionsCsv);

  // 5. repositories.csv
  const repositoriesData: any[] = [];
  topology.teams.forEach((team) => {
    team.teamAPI.codeRepositories.forEach((repo) => {
      repositoriesData.push({
        id: repo.id,
        teamId: team.id,
        name: repo.name,
        url: repo.url || '',
        description: repo.description || '',
        primaryLanguage: repo.primaryLanguage || '',
      });
    });
  });
  const repositoriesCsv = Papa.unparse(repositoriesData);
  zip.file('repositories.csv', '\uFEFF' + repositoriesCsv);

  // 6. README.txt
  const readme = `Team Topologies CSV Export
===========================

This ZIP archive contains the following CSV files:

1. teams.csv - Team basic information
2. services.csv - Services provided by teams
3. dependencies.csv - Dependencies between teams
4. interactions.csv - Interaction modes between teams
5. repositories.csv - Code repositories managed by teams

To import this data back into Team Topologies Designer:
1. Use the Import → Import from CSV menu
2. Select this ZIP file or individual CSV files
3. Choose merge or replace mode

Generated: ${new Date().toISOString()}
Topology: ${topology.metadata.name}
Version: ${topology.version}
`;
  zip.file('README.txt', readme);

  // Generate ZIP and download
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${filename}.zip`);
}
