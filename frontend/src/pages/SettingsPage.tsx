import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Shield } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useWorkspace } from '@/hooks/useWorkspace'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { WorkspaceSettings } from '@/components/workspace/WorkspaceSettings'
import api from '@/api/axios'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
})

type FormData = z.infer<typeof schema>

export const SettingsPage: React.FC = () => {
  const { user, setUser } = useAuth()
  const { activeWorkspace } = useWorkspace()
  const [tab, setTab] = useState<'profile' | 'workspace'>('profile')
  const [saved, setSaved] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' },
  })

  const onSubmit = async (data: FormData) => {
    try {
      const updated = await api.patch('/auth/me', data).then((r) => r.data)
      setUser(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-bold text-text-primary mb-6">Settings</h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              tab === 'profile'
                ? 'bg-accent-blue/20 text-accent-blue-light border border-accent-blue/30'
                : 'text-text-secondary hover:bg-surface-tertiary'
            }`}
          >
            <User size={14} />
            Profile
          </button>
          {activeWorkspace && (
            <button
              onClick={() => setTab('workspace')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                tab === 'workspace'
                  ? 'bg-accent-blue/20 text-accent-blue-light border border-accent-blue/30'
                  : 'text-text-secondary hover:bg-surface-tertiary'
              }`}
            >
              <Shield size={14} />
              Workspace
            </button>
          )}
        </div>

        <div className="bg-surface-secondary border border-border-primary rounded-xl p-6">
          {tab === 'profile' && user && (
            <div className="space-y-5">
              <div className="flex items-center gap-4 mb-4">
                <Avatar name={user.name} src={user.avatar} size="lg" />
                <div>
                  <p className="font-medium text-text-primary">{user.name}</p>
                  <p className="text-sm text-text-muted">{user.email}</p>
                </div>
              </div>
              {saved && (
                <div className="bg-status-success/10 border border-status-success/30 text-status-success text-sm px-4 py-2 rounded-lg">
                  Profile saved!
                </div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input label="Full Name" error={errors.name?.message} {...register('name')} />
                <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
                <Button type="submit" loading={isSubmitting}>Save Changes</Button>
              </form>
            </div>
          )}
          {tab === 'workspace' && <WorkspaceSettings />}
        </div>
      </div>
    </div>
  )
}
