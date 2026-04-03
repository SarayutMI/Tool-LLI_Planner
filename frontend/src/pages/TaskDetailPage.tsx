import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTasks } from '@/hooks/useTasks'
import { TaskDetail } from '@/components/task/TaskDetail'
import * as taskApi from '@/api/task.api'

export const TaskDetailPage: React.FC = () => {
  const { taskId } = useParams()
  const { setActiveTask } = useTasks()

  useEffect(() => {
    if (taskId) {
      taskApi.getTask(taskId).then(setActiveTask).catch(() => setActiveTask(null))
    }
  }, [taskId, setActiveTask])

  return (
    <div className="min-h-screen bg-bg-primary">
      <TaskDetail />
    </div>
  )
}
