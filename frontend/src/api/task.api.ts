import api from './axios'
import type { Task, TaskPriority } from '@/types'

export const getTasks = (listId: string) =>
  api.get<Task[]>(`/lists/${listId}/tasks`).then((r) => r.data)

export const createTask = (data: {
  title: string
  description?: string
  status: string
  priority: TaskPriority
  listId: string
  parentTaskId?: string
  dueDate?: string
  startDate?: string
  tags?: string[]
}) => api.post<Task>('/tasks', data).then((r) => r.data)

export const getTask = (taskId: string) =>
  api.get<Task>(`/tasks/${taskId}`).then((r) => r.data)

export const updateTask = (taskId: string, data: Partial<Task>) =>
  api.patch<Task>(`/tasks/${taskId}`, data).then((r) => r.data)

export const deleteTask = (taskId: string) =>
  api.delete(`/tasks/${taskId}`).then((r) => r.data)

export const updateTaskStatus = (taskId: string, status: string) =>
  api.patch<Task>(`/tasks/${taskId}/status`, { status }).then((r) => r.data)

export const updateTaskPriority = (taskId: string, priority: TaskPriority) =>
  api.patch<Task>(`/tasks/${taskId}/priority`, { priority }).then((r) => r.data)

export const addAssignee = (taskId: string, userId: string) =>
  api.post(`/tasks/${taskId}/assignees`, { userId }).then((r) => r.data)

export const removeAssignee = (taskId: string, userId: string) =>
  api.delete(`/tasks/${taskId}/assignees/${userId}`).then((r) => r.data)

export const reorderTasks = (listId: string, taskIds: string[]) =>
  api.patch(`/lists/${listId}/tasks/reorder`, { taskIds }).then((r) => r.data)

export const getSubtasks = (taskId: string) =>
  api.get<Task[]>(`/tasks/${taskId}/subtasks`).then((r) => r.data)
