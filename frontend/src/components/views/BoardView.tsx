import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTasks } from '@/hooks/useTasks'
import { useWorkspace } from '@/hooks/useWorkspace'
import { useParams } from 'react-router-dom'
import { TaskCard } from '@/components/task/TaskCard'
import { TaskDetail } from '@/components/task/TaskDetail'
import { TaskForm } from '@/components/task/TaskForm'
import type { TaskStatus } from '@/types'

export const BoardView: React.FC = () => {
  const { tasks, activeTask } = useTasks()
  const { lists } = useWorkspace()
  const { listId } = useParams()
  const [addingToStatus, setAddingToStatus] = useState<string | null>(null)

  const list = lists.find((l) => l.id === listId)
  const statuses: TaskStatus[] = list?.statusConfig ?? [
    { name: 'TO DO', color: '#94a3b8' },
    { name: 'IN PROGRESS', color: '#3b82f6' },
    { name: 'DONE', color: '#22c55e' },
  ]

  return (
    <div className="flex h-full overflow-x-auto p-4 gap-3">
      {statuses.map((status) => {
        const columnTasks = tasks.filter((t) => t.status === status.name && !t.parentTaskId)
        return (
          <div
            key={status.name}
            className="flex-shrink-0 w-72 flex flex-col bg-surface-secondary rounded-lg border border-border-primary max-h-full"
          >
            <div className="flex items-center gap-2 px-3 py-3 border-b border-border-primary">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: status.color }} />
              <span className="text-sm font-medium text-text-primary flex-1">{status.name}</span>
              <span className="text-xs text-text-muted bg-surface-tertiary px-1.5 py-0.5 rounded-full">
                {columnTasks.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {addingToStatus === status.name && list ? (
                <TaskForm list={list} onClose={() => setAddingToStatus(null)} />
              ) : (
                <button
                  onClick={() => setAddingToStatus(status.name)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:text-text-primary hover:bg-surface-tertiary rounded-lg transition-colors"
                >
                  <Plus size={14} />
                  Add card
                </button>
              )}
            </div>
          </div>
        )
      })}
      {activeTask && <TaskDetail />}
    </div>
  )
}
