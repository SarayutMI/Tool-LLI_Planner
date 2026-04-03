import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { DashboardPage } from './DashboardPage'
import { useTasks } from '@/hooks/useTasks'
import { useWorkspace } from '@/hooks/useWorkspace'

export const WorkspacePage: React.FC = () => {
  const { listId, workspaceId } = useParams()
  const { fetchTasks } = useTasks()
  const { fetchWorkspaces, setActiveWorkspace, fetchSpaces } = useWorkspace()

  useEffect(() => {
    fetchWorkspaces().then(() => {
      if (workspaceId) {
        setActiveWorkspace(workspaceId)
        fetchSpaces(workspaceId)
      }
    })
  }, [workspaceId, fetchWorkspaces, setActiveWorkspace, fetchSpaces])

  useEffect(() => {
    if (listId) {
      fetchTasks(listId)
    }
  }, [listId, fetchTasks])

  return <AppLayout />
}
