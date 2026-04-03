import React from 'react'
import { ChevronRight, ChevronDown, Folder } from 'lucide-react'
import type { Folder as FolderType } from '@/types'

interface FolderItemProps {
  folder: FolderType
  isExpanded: boolean
  onToggle: () => void
  children?: React.ReactNode
}

export const FolderItem: React.FC<FolderItemProps> = ({ folder, isExpanded, onToggle, children }) => {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-colors"
      >
        {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <Folder size={12} style={{ color: folder.color }} className="flex-shrink-0" />
        <span className="truncate">{folder.name}</span>
      </button>
      {isExpanded && <div className="ml-4">{children}</div>}
    </div>
  )
}
