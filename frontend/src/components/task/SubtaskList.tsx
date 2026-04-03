import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import type { Task } from '@/types'
import { useTasks } from '@/hooks/useTasks'
import { useWorkspace } from '@/hooks/useWorkspace'
import { TaskRow } from './TaskRow'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { TaskPriority } from '@/types'

interface SubtaskListProps {
  parentTask: Task
}

export const SubtaskList: React.FC<SubtaskListProps> = ({ parentTask }) => {
  const { createTask } = useTasks()
  const { lists } = useWorkspace()
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const subtasks = parentTask.subtasks ?? []
  const list = lists.find((l) => l.id === parentTask.listId)
  const defaultStatus = list?.statusConfig[0]?.name ?? 'TO DO'

  const handleAdd = async () => {
    if (!title.trim()) return
    setLoading(true)
    try {
      await createTask({
        title: title.trim(),
        status: defaultStatus,
        priority: TaskPriority.NONE,
        listId: parentTask.listId,
        parentTaskId: parentTask.id,
        tags: [],
      })
      setTitle('')
      setAdding(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-1">
      {subtasks.map((subtask) => (
        <TaskRow key={subtask.id} task={subtask} />
      ))}
      {adding ? (
        <div className="flex items-center gap-2 mt-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Subtask title..."
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button size="sm" loading={loading} onClick={handleAdd}>Add</Button>
          <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          icon={<Plus size={13} />}
          onClick={() => setAdding(true)}
          className="mt-1"
        >
          Add subtask
        </Button>
      )}
    </div>
  )
}
