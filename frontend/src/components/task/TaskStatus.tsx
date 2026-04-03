import React, { useState } from 'react'
import { ChevronDown, Circle } from 'lucide-react'
import type { TaskStatus } from '@/types'
import { useTasks } from '@/hooks/useTasks'

interface TaskStatusSelectorProps {
  taskId: string
  currentStatus: string
  statuses: TaskStatus[]
}

export const TaskStatusSelector: React.FC<TaskStatusSelectorProps> = ({ taskId, currentStatus, statuses }) => {
  const { updateTask } = useTasks()
  const [open, setOpen] = useState(false)

  const current = statuses.find((s) => s.name === currentStatus)

  const handleSelect = async (status: TaskStatus) => {
    setOpen(false)
    await updateTask(taskId, { status: status.name })
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border-primary hover:border-border-secondary text-sm transition-colors w-full"
      >
        <Circle size={10} fill={current?.color ?? '#94a3b8'} style={{ color: current?.color ?? '#94a3b8' }} />
        <span className="text-text-primary flex-1 text-left">{currentStatus}</span>
        <ChevronDown size={12} className="text-text-muted" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-44 bg-surface-secondary border border-border-primary rounded-lg shadow-xl z-50 py-1">
          {statuses.map((s) => (
            <button
              key={s.name}
              onClick={() => handleSelect(s)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-tertiary transition-colors ${
                currentStatus === s.name ? 'text-accent-blue-light' : 'text-text-primary'
              }`}
            >
              <Circle size={10} fill={s.color} style={{ color: s.color }} />
              {s.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
