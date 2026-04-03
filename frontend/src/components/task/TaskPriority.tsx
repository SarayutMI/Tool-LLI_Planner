import React, { useState } from 'react'
import { Flag, ChevronDown } from 'lucide-react'
import { TaskPriority } from '@/types'
import { getPriorityColor, getPriorityLabel } from '@/utils/helpers'
import { useTasks } from '@/hooks/useTasks'
import * as taskApi from '@/api/task.api'

const priorities = [
  TaskPriority.URGENT,
  TaskPriority.HIGH,
  TaskPriority.NORMAL,
  TaskPriority.LOW,
  TaskPriority.NONE,
]

interface TaskPrioritySelectorProps {
  taskId: string
  currentPriority: TaskPriority
}

export const TaskPrioritySelector: React.FC<TaskPrioritySelectorProps> = ({ taskId, currentPriority }) => {
  const { updateTask } = useTasks()
  const [open, setOpen] = useState(false)

  const handleSelect = async (priority: TaskPriority) => {
    setOpen(false)
    await updateTask(taskId, { priority })
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border-primary hover:border-border-secondary text-sm transition-colors w-full"
      >
        <Flag size={13} style={{ color: getPriorityColor(currentPriority) }} />
        <span className="text-text-primary flex-1 text-left">{getPriorityLabel(currentPriority)}</span>
        <ChevronDown size={12} className="text-text-muted" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-40 bg-surface-secondary border border-border-primary rounded-lg shadow-xl z-50 py-1">
          {priorities.map((p) => (
            <button
              key={p}
              onClick={() => handleSelect(p)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-tertiary transition-colors ${
                currentPriority === p ? 'text-accent-blue-light' : 'text-text-primary'
              }`}
            >
              <Flag size={13} style={{ color: getPriorityColor(p) }} />
              {getPriorityLabel(p)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
