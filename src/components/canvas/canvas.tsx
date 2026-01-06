'use client';

import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  addEdge,
  OnConnect,
  OnNodesChange,
  OnEdgesChange,
  NodeTypes,
} from '@xyflow/react';
import { useTopologyStore } from '@/store/topology-store';
import { TeamNode } from '../team-node/team-node';
import { TeamType, InteractionMode } from '@/types/team';
import { INTERACTION_MODES } from '@/lib/constants';
import { useEffect } from 'react';

const nodeTypes: NodeTypes = {
  team: TeamNode,
};

export function Canvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { teams, interactions, addTeam, updateTeam, addInteraction, selectTeam, filteredTeamIds } =
    useTopologyStore();

  // Sync teams to nodes
  useEffect(() => {
    const newNodes: Node[] = teams.map((team) => ({
      id: team.id,
      type: 'team',
      position: team.position,
      data: team,
    }));
    setNodes(newNodes);
  }, [teams, setNodes]);

  // Sync interactions to edges
  useEffect(() => {
    const newEdges: Edge[] = interactions.map((interaction) => {
      const modeInfo = INTERACTION_MODES[interaction.mode];

      // Determine if this edge should be dimmed
      const isDimmed = filteredTeamIds !== null &&
        (!filteredTeamIds.includes(interaction.sourceTeamId) ||
         !filteredTeamIds.includes(interaction.targetTeamId));

      return {
        id: interaction.id,
        source: interaction.sourceTeamId,
        target: interaction.targetTeamId,
        type: 'default',
        animated: modeInfo.animated && !isDimmed,
        label: interaction.label,
        style: {
          stroke: modeInfo.color,
          strokeWidth: 2,
          strokeDasharray: modeInfo.strokeStyle === 'dashed' ? '5,5' : undefined,
          opacity: isDimmed ? 0.2 : 1,
          transition: 'opacity 200ms',
        },
        labelStyle: {
          fontSize: 12,
          fontWeight: 500,
          opacity: isDimmed ? 0.3 : 1,
        },
        labelBgStyle: {
          fill: '#ffffff',
          fillOpacity: isDimmed ? 0.5 : 0.9,
        },
        data: interaction,
      };
    });
    setEdges(newEdges);
  }, [interactions, filteredTeamIds, setEdges]);

  // Handle node drag end - update team position
  const handleNodesChange: OnNodesChange<Node> = useCallback(
    (changes) => {
      onNodesChange(changes);
      changes.forEach((change) => {
        if (change.type === 'position' && change.position && change.dragging === false) {
          updateTeam(change.id, { position: change.position });
        }
      });
    },
    [onNodesChange, updateTeam]
  );

  // Handle new connection (interaction)
  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        // Default to x-as-a-service mode
        addInteraction(connection.source, connection.target, 'x-as-a-service');
      }
    },
    [addInteraction]
  );

  // Handle drop on canvas
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/team-type') as TeamType;
      if (!type || !reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      addTeam(type, position);
    },
    [addTeam]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      selectTeam(node.id);
    },
    [selectTeam]
  );

  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      useTopologyStore.getState().selectInteraction(edge.id);
    },
    []
  );

  return (
    <div ref={reactFlowWrapper} className="flex-1 bg-gray-100">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
