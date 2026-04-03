import { useTaskStore } from '@/store/taskStore'

export function useTasks() {
  const tasks = useTaskStore((s) => s.tasks)
  const activeTask = useTaskStore((s) => s.activeTask)
  const isLoading = useTaskStore((s) => s.isLoading)
  const filters = useTaskStore((s) => s.filters)
  const viewType = useTaskStore((s) => s.viewType)
  const fetchTasks = useTaskStore((s) => s.fetchTasks)
  const createTask = useTaskStore((s) => s.createTask)
  const updateTask = useTaskStore((s) => s.updateTask)
  const deleteTask = useTaskStore((s) => s.deleteTask)
  const setActiveTask = useTaskStore((s) => s.setActiveTask)
  const setViewType = useTaskStore((s) => s.setViewType)
  const reorderTasks = useTaskStore((s) => s.reorderTasks)
  const setFilters = useTaskStore((s) => s.setFilters)

  return {
    tasks,
    activeTask,
    isLoading,
    filters,
    viewType,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    setActiveTask,
    setViewType,
    reorderTasks,
    setFilters,
  }
}
