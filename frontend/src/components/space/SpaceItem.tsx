import React from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import type { Space } from '@/types'

interface SpaceItemProps {
  space: Space
  isExpanded: boolean
  onToggle: () => void
  children?: React.ReactNode
}

export const SpaceItem: React.FC<SpaceItemProps> = ({ space, isExpanded, onToggle, children }) => {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-colors"
      >
        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <div className="w-4 h-4 rounded flex-shrink-0" style={{ backgroundColor: space.color }} />
        <span className="truncate font-medium">{space.name}</span>
      </button>
      {isExpanded && <div className="ml-4">{children}</div>}
    </div>
  )
}
