import { useWorkspaceStore } from '@/store/workspaceStore'

export function useWorkspace() {
  const workspaces = useWorkspaceStore((s) => s.workspaces)
  const activeWorkspace = useWorkspaceStore((s) => s.activeWorkspace)
  const spaces = useWorkspaceStore((s) => s.spaces)
  const folders = useWorkspaceStore((s) => s.folders)
  const lists = useWorkspaceStore((s) => s.lists)
  const isLoading = useWorkspaceStore((s) => s.isLoading)
  const fetchWorkspaces = useWorkspaceStore((s) => s.fetchWorkspaces)
  const setActiveWorkspace = useWorkspaceStore((s) => s.setActiveWorkspace)
  const fetchSpaces = useWorkspaceStore((s) => s.fetchSpaces)
  const fetchFolders = useWorkspaceStore((s) => s.fetchFolders)
  const fetchLists = useWorkspaceStore((s) => s.fetchLists)

  return {
    workspaces,
    activeWorkspace,
    spaces,
    folders,
    lists,
    isLoading,
    fetchWorkspaces,
    setActiveWorkspace,
    fetchSpaces,
    fetchFolders,
    fetchLists,
  }
}
