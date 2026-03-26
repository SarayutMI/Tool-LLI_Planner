import api from './axios'
import type { Space } from '@/types'

export const getSpaces = (workspaceId: string) =>
  api.get<Space[]>(`/workspaces/${workspaceId}/spaces`).then((r) => r.data)

export const createSpace = (workspaceId: string, data: { name: string; color: string; icon?: string; isPrivate?: boolean }) =>
  api.post<Space>(`/workspaces/${workspaceId}/spaces`, data).then((r) => r.data)

export const getSpace = (spaceId: string) =>
  api.get<Space>(`/spaces/${spaceId}`).then((r) => r.data)

export const updateSpace = (spaceId: string, data: Partial<{ name: string; color: string; icon: string; isPrivate: boolean }>) =>
  api.patch<Space>(`/spaces/${spaceId}`, data).then((r) => r.data)

export const deleteSpace = (spaceId: string) =>
  api.delete(`/spaces/${spaceId}`).then((r) => r.data)
