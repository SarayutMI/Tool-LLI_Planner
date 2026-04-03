import React from 'react'
import { Calendar, Flag } from 'lucide-react'
import type { Task } from '@/types'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { getPriorityColor, getPriorityLabel, formatDate } from '@/utils/helpers'
import { useTasks } from '@/hooks/useTasks'

interface TaskCardProps {
  task: Task
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { setActiveTask } = useTasks()

  return (
    <div
      onClick={() => setActiveTask(task)}
      className="bg-surface-secondary border border-border-primary rounded-lg p-3 cursor-pointer hover:border-accent-blue/40 hover:bg-surface-tertiary transition-all group"
    >
      <p className="text-sm text-text-primary font-medium mb-2 line-clamp-2">{task.title}</p>

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} label={tag} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          {task.assignees.slice(0, 3).map((a) => (
            <Avatar key={a.userId} name={a.user.name} src={a.user.avatar} size="xs" />
          ))}
        </div>
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <span className="flex items-center gap-1 text-xs text-text-muted">
              <Calendar size={10} />
              {formatDate(task.dueDate, 'MMM d')}
            </span>
          )}
          <span title={getPriorityLabel(task.priority)}>
            <Flag size={12} style={{ color: getPriorityColor(task.priority) }} />
          </span>
        </div>
      </div>
    </div>
  )
}
