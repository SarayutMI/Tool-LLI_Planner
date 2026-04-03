import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, ChevronDown, ChevronRight, Folder, List, Hash, Settings, LogOut } from 'lucide-react'
import { useWorkspace } from '@/hooks/useWorkspace'
import { useAuth } from '@/hooks/useAuth'
import { Avatar } from '@/components/ui/Avatar'
import { WorkspaceSelector } from '@/components/workspace/WorkspaceSelector'
import { CreateSpaceModal } from '@/components/space/CreateSpaceModal'
import { CreateFolderModal } from '@/components/folder/CreateFolderModal'
import { CreateListModal } from '@/components/list/CreateListModal'
import { Dropdown } from '@/components/ui/Dropdown'
import type { Space, Folder as FolderType, List as ListType } from '@/types'

export const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const { listId } = useParams()
  const { user, logout } = useAuth()
  const { activeWorkspace, spaces, folders, lists, fetchSpaces, fetchFolders, fetchLists } = useWorkspace()

  const [expandedSpaces, setExpandedSpaces] = useState<Set<string>>(new Set())
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [showCreateSpace, setShowCreateSpace] = useState(false)
  const [createFolderSpaceId, setCreateFolderSpaceId] = useState<string | null>(null)
  const [createListTarget, setCreateListTarget] = useState<{ spaceId: string; folderId?: string } | null>(null)

  useEffect(() => {
    if (activeWorkspace) {
      fetchSpaces(activeWorkspace.id)
    }
  }, [activeWorkspace, fetchSpaces])

  const toggleSpace = (spaceId: string) => {
    setExpandedSpaces((prev) => {
      const next = new Set(prev)
      if (next.has(spaceId)) {
        next.delete(spaceId)
      } else {
        next.add(spaceId)
        fetchFolders(spaceId)
        fetchLists(undefined, spaceId)
      }
      return next
    })
  }

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(folderId)) {
        next.delete(folderId)
      } else {
        next.add(folderId)
        fetchLists(folderId)
      }
      return next
    })
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const spaceFolders = (spaceId: string) => folders.filter((f) => f.spaceId === spaceId)
  const spaceLists = (spaceId: string) => lists.filter((l) => l.spaceId === spaceId && !l.folderId)
  const folderLists = (folderId: string) => lists.filter((l) => l.folderId === folderId)

  const getSpaceContextMenu = (space: Space) => [
    {
      label: 'Add Folder',
      icon: <Folder size={14} />,
      onClick: () => setCreateFolderSpaceId(space.id),
    },
    {
      label: 'Add List',
      icon: <List size={14} />,
      onClick: () => setCreateListTarget({ spaceId: space.id }),
    },
  ]

  const getFolderContextMenu = (folder: FolderType) => [
    {
      label: 'Add List',
      icon: <List size={14} />,
      onClick: () => setCreateListTarget({ spaceId: folder.spaceId, folderId: folder.id }),
    },
  ]

  const renderList = (list: ListType) => (
    <button
      key={list.id}
      onClick={() => navigate(`/workspace/${activeWorkspace?.id}/list/${list.id}`)}
      className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
        listId === list.id
          ? 'bg-accent-blue/20 text-accent-blue-light'
          : 'text-text-secondary hover:text-text-primary hover:bg-surface-tertiary'
      }`}
    >
      <Hash size={12} style={{ color: list.color }} className="flex-shrink-0" />
      <span className="truncate">{list.name}</span>
    </button>
  )

  return (
    <aside className="w-60 flex-shrink-0 bg-surface-primary border-r border-border-primary flex flex-col h-full">
      <div className="px-3 py-3 border-b border-border-primary">
        <WorkspaceSelector />
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {spaces.map((space) => (
          <div key={space.id}>
            <div className="flex items-center group">
              <button
                onClick={() => toggleSpace(space.id)}
                className="flex-1 flex items-center gap-2 px-2 py-1.5 text-sm rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-colors"
              >
                {expandedSpaces.has(space.id) ? (
                  <ChevronDown size={14} className="flex-shrink-0" />
                ) : (
                  <ChevronRight size={14} className="flex-shrink-0" />
                )}
                <div
                  className="w-4 h-4 rounded flex-shrink-0"
                  style={{ backgroundColor: space.color }}
                />
                <span className="truncate font-medium">{space.name}</span>
              </button>
              <Dropdown
                trigger={
                  <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-surface-tertiary text-text-muted">
                    <Plus size={14} />
                  </button>
                }
                items={getSpaceContextMenu(space)}
              />
            </div>

            {expandedSpaces.has(space.id) && (
              <div className="ml-4 space-y-0.5 mt-0.5">
                {spaceFolders(space.id).map((folder) => (
                  <div key={folder.id}>
                    <div className="flex items-center group">
                      <button
                        onClick={() => toggleFolder(folder.id)}
                        className="flex-1 flex items-center gap-2 px-2 py-1.5 text-sm rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-colors"
                      >
                        {expandedFolders.has(folder.id) ? (
                          <ChevronDown size={12} className="flex-shrink-0" />
                        ) : (
                          <ChevronRight size={12} className="flex-shrink-0" />
                        )}
                        <Folder size={12} style={{ color: folder.color }} className="flex-shrink-0" />
                        <span className="truncate">{folder.name}</span>
                      </button>
                      <Dropdown
                        trigger={
                          <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-surface-tertiary text-text-muted">
                            <Plus size={12} />
                          </button>
                        }
                        items={getFolderContextMenu(folder)}
                      />
                    </div>
                    {expandedFolders.has(folder.id) && (
                      <div className="ml-4 space-y-0.5 mt-0.5">
                        {folderLists(folder.id).map(renderList)}
                      </div>
                    )}
                  </div>
                ))}
                {spaceLists(space.id).map(renderList)}
              </div>
            )}
          </div>
        ))}

        <button
          onClick={() => setShowCreateSpace(true)}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md text-text-muted hover:text-text-primary hover:bg-surface-tertiary transition-colors"
        >
          <Plus size={14} />
          <span>New Space</span>
        </button>
      </nav>

      {user && (
        <div className="border-t border-border-primary px-3 py-3">
          <Dropdown
            trigger={
              <button className="w-full flex items-center gap-2 rounded-lg p-2 hover:bg-surface-tertiary transition-colors">
                <Avatar name={user.name} src={user.avatar} size="sm" />
                <span className="flex-1 text-sm text-text-primary truncate text-left">{user.name}</span>
              </button>
            }
            items={[
              {
                label: 'Settings',
                icon: <Settings size={14} />,
                onClick: () => navigate('/settings'),
              },
              {
                label: 'Sign Out',
                icon: <LogOut size={14} />,
                onClick: handleLogout,
                danger: true,
              },
            ]}
          />
        </div>
      )}

      {showCreateSpace && activeWorkspace && (
        <CreateSpaceModal
          workspaceId={activeWorkspace.id}
          onClose={() => setShowCreateSpace(false)}
        />
      )}
      {createFolderSpaceId && (
        <CreateFolderModal
          spaceId={createFolderSpaceId}
          onClose={() => setCreateFolderSpaceId(null)}
        />
      )}
      {createListTarget && (
        <CreateListModal
          spaceId={createListTarget.spaceId}
          folderId={createListTarget.folderId}
          onClose={() => setCreateListTarget(null)}
        />
      )}
    </aside>
  )
}
