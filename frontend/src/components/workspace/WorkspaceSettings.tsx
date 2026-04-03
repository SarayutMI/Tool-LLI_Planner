import React, { useState } from 'react'
import { Trash2, UserPlus, Shield } from 'lucide-react'
import { useWorkspaceStore } from '@/store/workspaceStore'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import * as workspaceApi from '@/api/workspace.api'
import { MemberRole } from '@/types'

export const WorkspaceSettings: React.FC = () => {
  const activeWorkspace = useWorkspaceStore((s) => s.activeWorkspace)
  const fetchWorkspaces = useWorkspaceStore((s) => s.fetchWorkspaces)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!activeWorkspace) return null

  const handleInvite = async () => {
    if (!inviteEmail) return
    setInviting(true)
    setError(null)
    try {
      await workspaceApi.addMember(activeWorkspace.id, inviteEmail, MemberRole.MEMBER)
      await fetchWorkspaces()
      setInviteEmail('')
    } catch {
      setError('Failed to invite member')
    } finally {
      setInviting(false)
    }
  }

  const handleRemove = async (userId: string) => {
    try {
      await workspaceApi.removeMember(activeWorkspace.id, userId)
      await fetchWorkspaces()
    } catch {
      // ignore
    }
  }

  const roleColor: Record<MemberRole, string> = {
    [MemberRole.OWNER]: '#f59e0b',
    [MemberRole.ADMIN]: '#3b82f6',
    [MemberRole.MEMBER]: '#94a3b8',
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">Members</h3>
        <div className="space-y-2">
          {activeWorkspace.members.map((m) => (
            <div key={m.userId} className="flex items-center gap-3 p-3 bg-surface-tertiary rounded-lg">
              <Avatar name={m.user.name} src={m.user.avatar} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{m.user.name}</p>
                <p className="text-xs text-text-muted truncate">{m.user.email}</p>
              </div>
              <Badge label={m.role} color={roleColor[m.role]} />
              {m.role !== MemberRole.OWNER && (
                <button
                  onClick={() => handleRemove(m.userId)}
                  className="p-1.5 rounded hover:bg-surface-secondary text-text-muted hover:text-status-danger transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">Invite Member</h3>
        {error && <p className="text-xs text-status-danger mb-2">{error}</p>}
        <div className="flex gap-2">
          <Input
            placeholder="Email address"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            icon={<UserPlus size={14} />}
          />
          <Button onClick={handleInvite} loading={inviting} icon={<Shield size={14} />}>
            Invite
          </Button>
        </div>
      </div>
    </div>
  )
}
