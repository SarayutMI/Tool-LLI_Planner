import api from './axios'
import type { Comment } from '@/types'

export const getComments = (taskId: string) =>
  api.get<Comment[]>(`/tasks/${taskId}/comments`).then((r) => r.data)

export const addComment = (taskId: string, data: { content: string; parentId?: string }) =>
  api.post<Comment>(`/tasks/${taskId}/comments`, data).then((r) => r.data)

export const updateComment = (commentId: string, content: string) =>
  api.patch<Comment>(`/comments/${commentId}`, { content }).then((r) => r.data)

export const deleteComment = (commentId: string) =>
  api.delete(`/comments/${commentId}`).then((r) => r.data)

export const addReaction = (commentId: string, emoji: string) =>
  api.post(`/comments/${commentId}/reactions`, { emoji }).then((r) => r.data)
