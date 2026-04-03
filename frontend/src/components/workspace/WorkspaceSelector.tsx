import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronDown, Plus, Check } from 'lucide-react'
import { useWorkspace } from '@/hooks/useWorkspace'
import { CreateWorkspaceModal } from './CreateWorkspaceModal'

export const WorkspaceSelector: React.FC = () => {
  const navigate = useNavigate()
  const { workspaceId } = useParams()
  const { workspaces, activeWorkspace, setActiveWorkspace, fetchSpaces } = useWorkspace()
  const [open, setOpen] = useState(false)
  const [showCreate, setShowCreate] = useState(false)

  const handleSelect = (id: string) => {
    setActiveWorkspace(id)
    fetchSpaces(id)
    navigate(`/workspace/${id}`)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-tertiary transition-colors"
      >
        <div
          className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ backgroundColor: activeWorkspace?.color ?? '#0075ff' }}
        >
          {activeWorkspace?.icon ?? activeWorkspace?.name?.[0] ?? 'W'}
        </div>
        <span className="flex-1 text-sm font-medium text-text-primary truncate text-left">
          {activeWorkspace?.name ?? 'Select Workspace'}
        </span>
        <ChevronDown size={14} className="text-text-muted flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface-secondary border border-border-primary rounded-lg shadow-xl z-50 py-1">
          {workspaces.map((ws) => (
            <button
              key={ws.id}
              onClick={() => handleSelect(ws.id)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-surface-tertiary transition-colors"
            >
              <div
                className="w-5 h-5 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: ws.color }}
              >
                {ws.icon ?? ws.name[0]}
              </div>
              <span className="flex-1 truncate text-left">{ws.name}</span>
              {(activeWorkspace?.id === ws.id || workspaceId === ws.id) && (
                <Check size={14} className="text-accent-blue" />
              )}
            </button>
          ))}
          <div className="border-t border-border-primary mt-1 pt-1">
            <button
              onClick={() => { setOpen(false); setShowCreate(true) }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-colors"
            >
              <Plus size={14} />
              New Workspace
            </button>
          </div>
        </div>
      )}

      {showCreate && <CreateWorkspaceModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}
