import React from 'react'
import { useWorkspace } from '@/hooks/useWorkspace'
import { useTasks } from '@/hooks/useTasks'
import { LayoutList, CheckSquare, Users, Layers } from 'lucide-react'

export const DashboardPage: React.FC = () => {
  const { activeWorkspace, spaces, lists } = useWorkspace()
  const { tasks } = useTasks()

  const completedTasks = tasks.filter((t) => t.status === 'DONE').length
  const inProgressTasks = tasks.filter((t) => t.status === 'IN PROGRESS').length

  const stats = [
    { label: 'Spaces', value: spaces.length, icon: Layers, color: '#3b82f6' },
    { label: 'Lists', value: lists.length, icon: LayoutList, color: '#8b5cf6' },
    { label: 'Total Tasks', value: tasks.length, icon: CheckSquare, color: '#22c55e' },
    { label: 'In Progress', value: inProgressTasks, icon: Users, color: '#f59e0b' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          {activeWorkspace?.name ?? 'Dashboard'}
        </h1>
        <p className="text-text-muted text-sm mt-1">Workspace overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface-secondary border border-border-primary rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-text-secondary">{stat.label}</p>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}22` }}
              >
                <stat.icon size={16} style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
          </div>
        ))}
      </div>

      {tasks.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-text-primary mb-3">Recent Tasks</h2>
          <div className="bg-surface-secondary border border-border-primary rounded-xl overflow-hidden">
            {tasks.slice(0, 5).map((task, i) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 px-4 py-3 ${i < 4 ? 'border-b border-border-primary' : ''}`}
              >
                <div className="w-2 h-2 rounded-full bg-accent-blue flex-shrink-0" />
                <span className="flex-1 text-sm text-text-primary truncate">{task.title}</span>
                <span className="text-xs text-text-muted">{task.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
