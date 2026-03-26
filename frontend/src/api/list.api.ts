import api from './axios'
import type { List, TaskStatus } from '@/types'

export const getLists = (folderId: string) =>
  api.get<List[]>(`/folders/${folderId}/lists`).then((r) => r.data)

export const getSpaceLists = (spaceId: string) =>
  api.get<List[]>(`/spaces/${spaceId}/lists`).then((r) => r.data)

export const createList = (data: { name: string; color: string; folderId?: string; spaceId: string; statusConfig?: TaskStatus[] }) =>
  api.post<List>('/lists', data).then((r) => r.data)

export const updateList = (listId: string, data: Partial<{ name: string; color: string; statusConfig: TaskStatus[] }>) =>
  api.patch<List>(`/lists/${listId}`, data).then((r) => r.data)

export const deleteList = (listId: string) =>
  api.delete(`/lists/${listId}`).then((r) => r.data)
