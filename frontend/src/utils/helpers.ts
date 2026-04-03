import { format, formatDistanceToNow } from 'date-fns'
import { TaskPriority } from '@/types'
import { PRIORITY_COLORS, PRIORITY_LABELS } from './constants'

export function formatDate(date: string | Date, pattern = 'MMM d, yyyy'): string {
  return format(new Date(date), pattern)
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function getPriorityColor(priority: TaskPriority): string {
  return PRIORITY_COLORS[priority] ?? '#94a3b8'
}

export function getPriorityLabel(priority: TaskPriority): string {
  return PRIORITY_LABELS[priority] ?? 'No Priority'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

export function generateColorFromString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colors = [
    '#0075ff', '#3b82f6', '#22c55e', '#f59e0b',
    '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6',
  ]
  return colors[Math.abs(hash) % colors.length]
}
