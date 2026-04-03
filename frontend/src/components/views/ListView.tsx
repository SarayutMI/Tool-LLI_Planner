import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Plus } from 'lucide-react'
import { useTasks } from '@/hooks/useTasks'
import { useWorkspace } from '@/hooks/useWorkspace'
import { useParams } from 'react-router-dom'
import { TaskRow } from '@/components/task/TaskRow'
import { TaskDetail } from '@/components/task/TaskDetail'
import { TaskForm } from '@/components/task/TaskForm'
import { Button } from '@/components/ui/Button'
import type { TaskStatus, List } from '@/types'

export const ListView: React.FC = () => {
  const { tasks, activeTask } = useTasks()
  const { lists } = useWorkspace()
  const { listId } = useParams()
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['TO DO', 'IN PROGRESS', 'REVIEW', 'DONE']))
  const [addingToStatus, setAddingToStatus] = useState<string | null>(null)

  const list = lists.find((l) => l.id === listId)
  const statuses: TaskStatus[] = list?.statusConfig ?? [
    { name: 'TO DO', color: '#94a3b8' },
    { name: 'IN PROGRESS', color: '#3b82f6' },
    { name: 'DONE', color: '#22c55e' },
  ]

  const toggleGroup = (name: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  return (
    <div className="flex h-full">
      <div className={`flex-1 overflow-y-auto ${activeTask ? 'mr-[672px]' : ''}`}>
        {!listId ? (
          <div className="flex items-center justify-center h-full text-text-muted">
            <p>Select a list to view tasks</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {statuses.map((status) => {
              const groupTasks = tasks.filter((t) => t.status === status.name && !t.parentTaskId)
              const isExpanded = expandedGroups.has(status.name)
              return (
                <div key={status.name} className="bg-surface-secondary rounded-lg border border-border-primary overflow-hidden">
                  <button
                    onClick={() => toggleGroup(status.name)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-tertiary transition-colors"
                  >
                    {isExpanded ? <ChevronDown size={14} className="text-text-muted" /> : <ChevronRight size={14} className="text-text-muted" />}
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: status.color }} />
                    <span className="text-sm font-medium text-text-primary">{status.name}</span>
                    <span className="text-xs text-text-muted bg-surface-tertiary px-1.5 py-0.5 rounded-full">
                      {groupTasks.length}
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="border-t border-border-primary">
                      {groupTasks.map((task) => (
                        <TaskRow key={task.id} task={task} statusColor={status.color} />
                      ))}
                      {addingToStatus === status.name && list ? (
                        <div className="px-4 py-3">
                          <TaskForm
                            list={list}
                            onClose={() => setAddingToStatus(null)}
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => setAddingToStatus(status.name)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-text-muted hover:text-text-primary hover:bg-surface-tertiary transition-colors border-t border-border-primary"
                        >
                          <Plus size={14} />
                          Add task
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
      {activeTask && <TaskDetail />}
    </div>
  )
}
