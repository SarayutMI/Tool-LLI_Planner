import React from 'react'
import type { Space } from '@/types'
import { Badge } from '@/components/ui/Badge'

interface SpaceSettingsProps {
  space: Space
}

export const SpaceSettings: React.FC<SpaceSettingsProps> = ({ space }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded" style={{ backgroundColor: space.color }} />
        <div>
          <p className="text-sm font-semibold text-text-primary">{space.name}</p>
          <Badge label={space.isPrivate ? 'Private' : 'Public'} color={space.isPrivate ? '#f59e0b' : '#22c55e'} />
        </div>
      </div>
      <p className="text-xs text-text-muted">{space.members.length} members</p>
    </div>
  )
}
