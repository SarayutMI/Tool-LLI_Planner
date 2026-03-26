import { create } from 'zustand'
import type { Workspace, Space, Folder, List } from '@/types'
import * as workspaceApi from '@/api/workspace.api'
import * as spaceApi from '@/api/space.api'
import * as folderApi from '@/api/folder.api'
import * as listApi from '@/api/list.api'
import type { TaskStatus } from '@/types'

interface WorkspaceState {
  workspaces: Workspace[]
  activeWorkspace: Workspace | null
  spaces: Space[]
  folders: Folder[]
  lists: List[]
  isLoading: boolean

  fetchWorkspaces: () => Promise<void>
  setActiveWorkspace: (id: string) => void
  createWorkspace: (data: { name: string; color: string; icon?: string }) => Promise<Workspace>
  updateWorkspace: (id: string, data: Partial<{ name: string; color: string; icon: string }>) => Promise<void>
  deleteWorkspace: (id: string) => Promise<void>

  fetchSpaces: (workspaceId: string) => Promise<void>
  createSpace: (workspaceId: string, data: { name: string; color: string; icon?: string; isPrivate?: boolean }) => Promise<Space>
  updateSpace: (spaceId: string, data: Partial<{ name: string; color: string; icon: string; isPrivate: boolean }>) => Promise<void>
  deleteSpace: (spaceId: string) => Promise<void>

  fetchFolders: (spaceId: string) => Promise<void>
  createFolder: (spaceId: string, data: { name: string; color: string }) => Promise<Folder>
  updateFolder: (folderId: string, data: Partial<{ name: string; color: string }>) => Promise<void>
  deleteFolder: (folderId: string) => Promise<void>

  fetchLists: (folderId?: string, spaceId?: string) => Promise<void>
  createList: (data: { name: string; color: string; folderId?: string; spaceId: string; statusConfig?: TaskStatus[] }) => Promise<List>
  updateList: (listId: string, data: Partial<{ name: string; color: string; statusConfig: TaskStatus[] }>) => Promise<void>
  deleteList: (listId: string) => Promise<void>
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [],
  activeWorkspace: null,
  spaces: [],
  folders: [],
  lists: [],
  isLoading: false,

  fetchWorkspaces: async () => {
    set({ isLoading: true })
    try {
      const workspaces = await workspaceApi.getWorkspaces()
      set({ workspaces })
      if (!get().activeWorkspace && workspaces.length > 0) {
        set({ activeWorkspace: workspaces[0] })
      }
    } finally {
      set({ isLoading: false })
    }
  },

  setActiveWorkspace: (id) => {
    const workspace = get().workspaces.find((w) => w.id === id)
    if (workspace) set({ activeWorkspace: workspace, spaces: [], folders: [], lists: [] })
  },

  createWorkspace: async (data) => {
    const workspace = await workspaceApi.createWorkspace(data)
    set((s) => ({ workspaces: [...s.workspaces, workspace] }))
    return workspace
  },

  updateWorkspace: async (id, data) => {
    const updated = await workspaceApi.updateWorkspace(id, data)
    set((s) => ({
      workspaces: s.workspaces.map((w) => (w.id === id ? updated : w)),
      activeWorkspace: s.activeWorkspace?.id === id ? updated : s.activeWorkspace,
    }))
  },

  deleteWorkspace: async (id) => {
    await workspaceApi.deleteWorkspace(id)
    set((s) => ({
      workspaces: s.workspaces.filter((w) => w.id !== id),
      activeWorkspace: s.activeWorkspace?.id === id ? null : s.activeWorkspace,
    }))
  },

  fetchSpaces: async (workspaceId) => {
    set({ isLoading: true })
    try {
      const spaces = await spaceApi.getSpaces(workspaceId)
      set({ spaces })
    } finally {
      set({ isLoading: false })
    }
  },

  createSpace: async (workspaceId, data) => {
    const space = await spaceApi.createSpace(workspaceId, data)
    set((s) => ({ spaces: [...s.spaces, space] }))
    return space
  },

  updateSpace: async (spaceId, data) => {
    const updated = await spaceApi.updateSpace(spaceId, data)
    set((s) => ({ spaces: s.spaces.map((sp) => (sp.id === spaceId ? updated : sp)) }))
  },

  deleteSpace: async (spaceId) => {
    await spaceApi.deleteSpace(spaceId)
    set((s) => ({ spaces: s.spaces.filter((sp) => sp.id !== spaceId) }))
  },

  fetchFolders: async (spaceId) => {
    set({ isLoading: true })
    try {
      const folders = await folderApi.getFolders(spaceId)
      set({ folders })
    } finally {
      set({ isLoading: false })
    }
  },

  createFolder: async (spaceId, data) => {
    const folder = await folderApi.createFolder(spaceId, data)
    set((s) => ({ folders: [...s.folders, folder] }))
    return folder
  },

  updateFolder: async (folderId, data) => {
    const updated = await folderApi.updateFolder(folderId, data)
    set((s) => ({ folders: s.folders.map((f) => (f.id === folderId ? updated : f)) }))
  },

  deleteFolder: async (folderId) => {
    await folderApi.deleteFolder(folderId)
    set((s) => ({ folders: s.folders.filter((f) => f.id !== folderId) }))
  },

  fetchLists: async (folderId, spaceId) => {
    set({ isLoading: true })
    try {
      let lists: List[]
      if (folderId) {
        lists = await listApi.getLists(folderId)
      } else if (spaceId) {
        lists = await listApi.getSpaceLists(spaceId)
      } else {
        lists = []
      }
      set({ lists })
    } finally {
      set({ isLoading: false })
    }
  },

  createList: async (data) => {
    const list = await listApi.createList(data)
    set((s) => ({ lists: [...s.lists, list] }))
    return list
  },

  updateList: async (listId, data) => {
    const updated = await listApi.updateList(listId, data)
    set((s) => ({ lists: s.lists.map((l) => (l.id === listId ? updated : l)) }))
  },

  deleteList: async (listId) => {
    await listApi.deleteList(listId)
    set((s) => ({ lists: s.lists.filter((l) => l.id !== listId) }))
  },
}))
