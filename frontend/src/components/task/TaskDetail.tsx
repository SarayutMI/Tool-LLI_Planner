import React, { useState, useEffect } from 'react'
import { X, Calendar, Flag, Tag, ChevronDown, ChevronRight } from 'lucide-react'
import { useTasks } from '@/hooks/useTasks'
import { useWorkspace } from '@/hooks/useWorkspace'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CommentList } from '@/components/comments/CommentList'
import { CommentInput } from '@/components/comments/CommentInput'
import { SubtaskList } from './SubtaskList'
import { TaskPrioritySelector } from './TaskPriority'
import { TaskStatusSelector } from './TaskStatus'
import { TaskAssigneeSelector } from './TaskAssignee'
import { getPriorityColor, getPriorityLabel, formatDate } from '@/utils/helpers'
import { DatePicker } from '@/components/ui/DatePicker'

export const TaskDetail: React.FC = () => {
  const { activeTask, setActiveTask, updateTask } = useTasks()
  const { lists } = useWorkspace()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [showSubtasks, setShowSubtasks] = useState(true)
  const [showComments, setShowComments] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (activeTask) {
      setTitle(activeTask.title)
      setDescription(activeTask.description ?? '')
    }
  }, [activeTask])

  if (!activeTask) return null

  const list = lists.find((l) => l.id === activeTask.listId)
  const statuses = list?.statusConfig ?? []

  const handleTitleBlur = async () => {
    if (title !== activeTask.title && title.trim()) {
      setIsSaving(true)
      try {
        await updateTask(activeTask.id, { title: title.trim() })
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleDescriptionBlur = async () => {
    if (description !== (activeTask.description ?? '')) {
      setIsSaving(true)
      try {
        await updateTask(activeTask.id, { description })
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleDueDateChange = async (date: string) => {
    await updateTask(activeTask.id, { dueDate: date || undefined })
  }

  const handleStartDateChange = async (date: string) => {
    await updateTask(activeTask.id, { startDate: date || undefined })
  }

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-surface-primary border-l border-border-primary z-40 flex flex-col shadow-2xl">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary flex-shrink-0">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span>Task Detail</span>
          {isSaving && <span className="text-accent-blue-light">Saving...</span>}
        </div>
        <button
          onClick={() => setActiveTask(null)}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-tertiary transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          className="w-full text-xl font-semibold text-text-primary bg-transparent border-none focus:outline-none resize-none leading-snug"
          rows={2}
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-text-muted mb-1.5">Status</p>
            <TaskStatusSelector
              taskId={activeTask.id}
              currentStatus={activeTask.status}
              statuses={statuses}
            />
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1.5">Priority</p>
            <TaskPrioritySelector taskId={activeTask.id} currentPriority={activeTask.priority} />
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1.5">Assignees</p>
            <TaskAssigneeSelector taskId={activeTask.id} assignees={activeTask.assignees} />
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1.5">Due Date</p>
            <DatePicker
              value={activeTask.dueDate ? activeTask.dueDate.split('T')[0] : ''}
              onChange={handleDueDateChange}
            />
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1.5">Start Date</p>
            <DatePicker
              value={activeTask.startDate ? activeTask.startDate.split('T')[0] : ''}
              onChange={handleStartDateChange}
            />
          </div>
          {activeTask.tags.length > 0 && (
            <div>
              <p className="text-xs text-text-muted mb-1.5">Tags</p>
              <div className="flex flex-wrap gap-1">
                {activeTask.tags.map((tag) => (
                  <Badge key={tag} label={tag} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <p className="text-xs text-text-muted mb-1.5">Description</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            placeholder="Add a description..."
            rows={4}
            className="w-full bg-surface-secondary border border-border-primary rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue resize-y"
          />
        </div>

        <div>
          <button
            onClick={() => setShowSubtasks((v) => !v)}
            className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2 w-full"
          >
            {showSubtasks ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            Subtasks
            {activeTask.subtasks && (
              <span className="text-xs text-text-muted">({activeTask.subtasks.length})</span>
            )}
          </button>
          {showSubtasks && <SubtaskList parentTask={activeTask} />}
        </div>

        <div>
          <button
            onClick={() => setShowComments((v) => !v)}
            className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2 w-full"
          >
            {showComments ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            Comments
          </button>
          {showComments && (
            <div className="space-y-3">
              <CommentList taskId={activeTask.id} />
              <CommentInput taskId={activeTask.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
