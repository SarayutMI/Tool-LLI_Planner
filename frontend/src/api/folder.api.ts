import api from './axios'
import type { Folder } from '@/types'

export const getFolders = (spaceId: string) =>
  api.get<Folder[]>(`/spaces/${spaceId}/folders`).then((r) => r.data)

export const createFolder = (spaceId: string, data: { name: string; color: string }) =>
  api.post<Folder>(`/spaces/${spaceId}/folders`, data).then((r) => r.data)

export const updateFolder = (folderId: string, data: Partial<{ name: string; color: string }>) =>
  api.patch<Folder>(`/folders/${folderId}`, data).then((r) => r.data)

export const deleteFolder = (folderId: string) =>
  api.delete(`/folders/${folderId}`).then((r) => r.data)
