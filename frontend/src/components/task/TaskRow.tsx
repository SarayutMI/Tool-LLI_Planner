import React, { useState } from 'react'
import { Check, Calendar, Flag } from 'lucide-react'
import type { Task } from '@/types'
import { Avatar } from '@/components/ui/Avatar'
import { getPriorityColor, formatDate } from '@/utils/helpers'
import { useTasks } from '@/hooks/useTasks'

interface TaskRowProps {
  task: Task
  statusColor?: string
}

export const TaskRow: React.FC<TaskRowProps> = ({ task, statusColor }) => {
  const { setActiveTask, updateTask } = useTasks()
  const [checked, setChecked] = useState(false)

  const handleCheck = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setChecked((v) => !v)
  }

  return (
    <div
      onClick={() => setActiveTask(task)}
      className="flex items-center gap-3 px-4 py-2.5 border-b border-border-primary hover:bg-surface-tertiary cursor-pointer group transition-colors"
    >
      <button
        onClick={handleCheck}
        className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
          checked
            ? 'bg-accent-blue border-accent-blue'
            : 'border-border-secondary hover:border-accent-blue'
        }`}
      >
        {checked && <Check size={10} className="text-white" />}
      </button>

      <span className="flex-1 text-sm text-text-primary truncate">{task.title}</span>

      <div className="flex items-center gap-3 ml-auto">
        {task.dueDate && (
          <span className="flex items-center gap-1 text-xs text-text-muted hidden sm:flex">
            <Calendar size={11} />
            {formatDate(task.dueDate, 'MMM d')}
          </span>
        )}

        <div className="flex items-center -space-x-1">
          {task.assignees.slice(0, 3).map((a) => (
            <Avatar key={a.userId} name={a.user.name} src={a.user.avatar} size="xs" className="border border-surface-secondary" />
          ))}
        </div>

        <Flag
          size={13}
          style={{ color: getPriorityColor(task.priority) }}
        />
      </div>
    </div>
  )
}
