import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useTasks } from '@/hooks/useTasks'
import { TaskPriority } from '@/types'
import type { List } from '@/types'

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface TaskFormProps {
  list: List
  onClose: () => void
  parentTaskId?: string
}

export const TaskForm: React.FC<TaskFormProps> = ({ list, onClose, parentTaskId }) => {
  const { createTask } = useTasks()
  const defaultStatus = list.statusConfig[0]?.name ?? 'TO DO'

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    await createTask({
      title: data.title,
      description: data.description,
      status: defaultStatus,
      priority: TaskPriority.NONE,
      listId: list.id,
      parentTaskId,
      tags: [],
    })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 p-3 bg-surface-secondary border border-border-primary rounded-lg">
      <Input
        placeholder="Task title"
        error={errors.title?.message}
        autoFocus
        {...register('title')}
      />
      <input
        {...register('description')}
        placeholder="Description (optional)"
        className="w-full bg-surface-tertiary border border-border-primary rounded-md px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent-blue"
      />
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancel</Button>
        <Button size="sm" type="submit" loading={isSubmitting}>Add Task</Button>
      </div>
    </form>
  )
}
