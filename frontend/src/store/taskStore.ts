import { create } from 'zustand'
import type { Task, TaskPriority } from '@/types'
import { ViewType } from '@/types'
import * as taskApi from '@/api/task.api'

interface TaskFilters {
  status: string[]
  priority: TaskPriority[]
  assigneeId: string[]
}

interface TaskState {
  tasks: Task[]
  activeTask: Task | null
  isLoading: boolean
  filters: TaskFilters
  viewType: ViewType

  fetchTasks: (listId: string) => Promise<void>
  createTask: (data: Parameters<typeof taskApi.createTask>[0]) => Promise<Task>
  updateTask: (taskId: string, data: Partial<Task>) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
  setActiveTask: (task: Task | null) => void
  setViewType: (type: ViewType) => void
  reorderTasks: (listId: string, taskIds: string[]) => Promise<void>
  setFilters: (filters: Partial<TaskFilters>) => void
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  activeTask: null,
  isLoading: false,
  filters: { status: [], priority: [], assigneeId: [] },
  viewType: ViewType.LIST,

  fetchTasks: async (listId) => {
    set({ isLoading: true })
    try {
      const tasks = await taskApi.getTasks(listId)
      set({ tasks })
    } finally {
      set({ isLoading: false })
    }
  },

  createTask: async (data) => {
    const task = await taskApi.createTask(data)
    set((s) => ({ tasks: [...s.tasks, task] }))
    return task
  },

  updateTask: async (taskId, data) => {
    const updated = await taskApi.updateTask(taskId, data)
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === taskId ? updated : t)),
      activeTask: s.activeTask?.id === taskId ? updated : s.activeTask,
    }))
  },

  deleteTask: async (taskId) => {
    await taskApi.deleteTask(taskId)
    set((s) => ({
      tasks: s.tasks.filter((t) => t.id !== taskId),
      activeTask: s.activeTask?.id === taskId ? null : s.activeTask,
    }))
  },

  setActiveTask: (task) => set({ activeTask: task }),

  setViewType: (type) => set({ viewType: type }),

  reorderTasks: async (listId, taskIds) => {
    await taskApi.reorderTasks(listId, taskIds)
    set((s) => {
      const sorted = [...s.tasks].sort(
        (a, b) => taskIds.indexOf(a.id) - taskIds.indexOf(b.id)
      )
      return { tasks: sorted }
    })
  },

  setFilters: (filters) =>
    set((s) => ({ filters: { ...s.filters, ...filters } })),
}))
