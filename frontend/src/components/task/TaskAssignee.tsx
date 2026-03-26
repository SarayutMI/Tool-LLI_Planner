import React, { useState } from 'react'
import { UserPlus, X } from 'lucide-react'
import type { TaskAssignee } from '@/types'
import { Avatar } from '@/components/ui/Avatar'
import * as taskApi from '@/api/task.api'
import { useTasks } from '@/hooks/useTasks'

interface TaskAssigneeSelectorProps {
  taskId: string
  assignees: TaskAssignee[]
}

export const TaskAssigneeSelector: React.FC<TaskAssigneeSelectorProps> = ({ taskId, assignees }) => {
  const { updateTask } = useTasks()

  const handleRemove = async (userId: string) => {
    try {
      await taskApi.removeAssignee(taskId, userId)
      await updateTask(taskId, {
        assignees: assignees.filter((a) => a.userId !== userId),
      })
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex items-center flex-wrap gap-1.5">
      {assignees.map((a) => (
        <div key={a.userId} className="relative group">
          <Avatar name={a.user.name} src={a.user.avatar} size="sm" />
          <button
            onClick={() => handleRemove(a.userId)}
            className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-status-danger rounded-full hidden group-hover:flex items-center justify-center"
          >
            <X size={8} className="text-white" />
          </button>
        </div>
      ))}
      <button className="w-7 h-7 rounded-full border border-dashed border-border-secondary hover:border-accent-blue flex items-center justify-center text-text-muted hover:text-accent-blue transition-colors">
        <UserPlus size={12} />
      </button>
    </div>
  )
}
