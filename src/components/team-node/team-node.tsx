'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Team } from '@/types/team';
import { TEAM_TYPES } from '@/lib/constants';
import { useTopologyStore } from '@/store/topology-store';

export const TeamNode = memo(({ data }: NodeProps<Team>) => {
  const teamTypeInfo = TEAM_TYPES[data.type];
  const filteredTeamIds = useTopologyStore((state) => state.filteredTeamIds);

  // Determine if this team should be dimmed
  const isDimmed = filteredTeamIds !== null && !filteredTeamIds.includes(data.id);

  return (
    <div
      className="px-4 py-3 rounded-lg border-2 shadow-md bg-white min-w-[200px] transition-opacity duration-200"
      style={{
        borderColor: teamTypeInfo.color,
        opacity: isDimmed ? 0.3 : 1,
      }}
    >
      <Handle type="target" position={Position.Top} />

      <div className="space-y-2">
        {/* Team Type Badge */}
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: teamTypeInfo.color }}
          />
          <span className="text-xs font-medium text-gray-600">
            {teamTypeInfo.label}
          </span>
        </div>

        {/* Team Name */}
        <h3 className="font-semibold text-sm">{data.name}</h3>

        {/* Team Description */}
        {data.description && (
          <p className="text-xs text-gray-500 line-clamp-2">{data.description}</p>
        )}

        {/* Member Count */}
        {data.memberCount && (
          <div className="text-xs text-gray-500">
            {data.memberCount} member{data.memberCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

TeamNode.displayName = 'TeamNode';
