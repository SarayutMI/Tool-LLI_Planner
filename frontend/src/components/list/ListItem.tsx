import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Hash } from 'lucide-react'
import type { List } from '@/types'

interface ListItemProps {
  list: List
}

export const ListItem: React.FC<ListItemProps> = ({ list }) => {
  const navigate = useNavigate()
  const { listId, workspaceId } = useParams()

  return (
    <button
      onClick={() => navigate(`/workspace/${workspaceId}/list/${list.id}`)}
      className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors ${
        listId === list.id
          ? 'bg-accent-blue/20 text-accent-blue-light'
          : 'text-text-secondary hover:text-text-primary hover:bg-surface-tertiary'
      }`}
    >
      <Hash size={12} style={{ color: list.color }} className="flex-shrink-0" />
      <span className="truncate">{list.name}</span>
    </button>
  )
}
