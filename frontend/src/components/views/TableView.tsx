import React, { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { useTasks } from '@/hooks/useTasks'
import { TaskDetail } from '@/components/task/TaskDetail'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { getPriorityColor, getPriorityLabel, formatDate } from '@/utils/helpers'
import { Flag, Calendar } from 'lucide-react'
import type { Task } from '@/types'

type SortKey = 'title' | 'status' | 'priority' | 'dueDate' | 'createdAt'

export const TableView: React.FC = () => {
  const { tasks, setActiveTask, activeTask } = useTasks()
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  const sorted = [...tasks].sort((a, b) => {
    let av: string = '', bv: string = ''
    switch (sortKey) {
      case 'title': av = a.title; bv = b.title; break
      case 'status': av = a.status; bv = b.status; break
      case 'priority': av = a.priority; bv = b.priority; break
      case 'dueDate': av = a.dueDate ?? ''; bv = b.dueDate ?? ''; break
      case 'createdAt': av = a.createdAt; bv = b.createdAt; break
    }
    return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
  })

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
    ) : null

  const cols: { key: SortKey; label: string }[] = [
    { key: 'title', label: 'Task' },
    { key: 'status', label: 'Status' },
    { key: 'priority', label: 'Priority' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'createdAt', label: 'Created' },
  ]

  return (
    <div className="flex h-full">
      <div className={`flex-1 overflow-auto p-4 ${activeTask ? 'mr-[672px]' : ''}`}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border-primary">
              {cols.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider cursor-pointer hover:text-text-primary select-none"
                >
                  <span className="flex items-center gap-1">
                    {col.label} <SortIcon k={col.key} />
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Assignees
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((task) => (
              <tr
                key={task.id}
                onClick={() => setActiveTask(task)}
                className="border-b border-border-primary hover:bg-surface-tertiary cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 text-sm text-text-primary font-medium max-w-xs truncate">
                  {task.title}
                </td>
                <td className="px-4 py-3">
                  <Badge label={task.status} />
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1.5 text-xs">
                    <Flag size={12} style={{ color: getPriorityColor(task.priority) }} />
                    <span className="text-text-secondary">{getPriorityLabel(task.priority)}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-text-secondary">
                  {task.dueDate ? (
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {formatDate(task.dueDate)}
                    </span>
                  ) : (
                    <span className="text-text-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-text-secondary">
                  {formatDate(task.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center -space-x-1">
                    {task.assignees.slice(0, 4).map((a) => (
                      <Avatar key={a.userId} name={a.user.name} src={a.user.avatar} size="xs" className="border border-surface-primary" />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sorted.length === 0 && (
          <div className="text-center py-16 text-text-muted text-sm">No tasks found</div>
        )}
      </div>
      {activeTask && <TaskDetail />}
    </div>
  )
}
