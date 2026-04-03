import api from './axios'
import type { Workspace } from '@/types'

export const getWorkspaces = () =>
  api.get<Workspace[]>('/workspaces').then((r) => r.data)

export const createWorkspace = (data: { name: string; color: string; icon?: string }) =>
  api.post<Workspace>('/workspaces', data).then((r) => r.data)

export const getWorkspace = (id: string) =>
  api.get<Workspace>(`/workspaces/${id}`).then((r) => r.data)

export const updateWorkspace = (id: string, data: Partial<{ name: string; color: string; icon: string }>) =>
  api.patch<Workspace>(`/workspaces/${id}`, data).then((r) => r.data)

export const deleteWorkspace = (id: string) =>
  api.delete(`/workspaces/${id}`).then((r) => r.data)

export const addMember = (workspaceId: string, email: string, role: string) =>
  api.post(`/workspaces/${workspaceId}/members`, { email, role }).then((r) => r.data)

export const removeMember = (workspaceId: string, userId: string) =>
  api.delete(`/workspaces/${workspaceId}/members/${userId}`).then((r) => r.data)

export const updateMemberRole = (workspaceId: string, userId: string, role: string) =>
  api.patch(`/workspaces/${workspaceId}/members/${userId}`, { role }).then((r) => r.data)
