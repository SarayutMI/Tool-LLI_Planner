import { TaskPriority } from '@/types'

export const API_BASE_URL = '/api'

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  [TaskPriority.NONE]: '#94a3b8',
  [TaskPriority.LOW]: '#3b82f6',
  [TaskPriority.NORMAL]: '#22c55e',
  [TaskPriority.HIGH]: '#f59e0b',
  [TaskPriority.URGENT]: '#ef4444',
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  [TaskPriority.NONE]: 'No Priority',
  [TaskPriority.LOW]: 'Low',
  [TaskPriority.NORMAL]: 'Normal',
  [TaskPriority.HIGH]: 'High',
  [TaskPriority.URGENT]: 'Urgent',
}

export const DEFAULT_STATUSES = [
  { name: 'TO DO', color: '#94a3b8' },
  { name: 'IN PROGRESS', color: '#3b82f6' },
  { name: 'REVIEW', color: '#f59e0b' },
  { name: 'DONE', color: '#22c55e' },
]

export const PRESET_COLORS = [
  '#0075ff',
  '#1e90ff',
  '#3b82f6',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
  '#64748b',
  '#94a3b8',
]
