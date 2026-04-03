import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { useWorkspaceStore } from '@/store/workspaceStore'
import { DEFAULT_STATUSES } from '@/utils/constants'
import type { TaskStatus } from '@/types'

const schema = z.object({ name: z.string().min(1, 'Name is required').max(50) })
type FormData = z.infer<typeof schema>

interface Props {
  spaceId: string
  folderId?: string
  onClose: () => void
}

export const CreateListModal: React.FC<Props> = ({ spaceId, folderId, onClose }) => {
  const createList = useWorkspaceStore((s) => s.createList)
  const [color, setColor] = useState('#0075ff')
  const [statuses, setStatuses] = useState<TaskStatus[]>(DEFAULT_STATUSES)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const addStatus = () =>
    setStatuses((prev) => [...prev, { name: 'NEW STATUS', color: '#94a3b8' }])

  const removeStatus = (i: number) =>
    setStatuses((prev) => prev.filter((_, idx) => idx !== i))

  const updateStatus = (i: number, field: keyof TaskStatus, value: string) =>
    setStatuses((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)))

  const onSubmit = async (data: FormData) => {
    setError(null)
    try {
      await createList({ name: data.name, color, spaceId, folderId, statusConfig: statuses })
      onClose()
    } catch {
      setError('Failed to create list')
    }
  }

  return (
    <Modal isOpen onClose={onClose} title="Create List" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {error && <p className="text-sm text-status-danger">{error}</p>}
        <Input label="List Name" placeholder="My List" error={errors.name?.message} {...register('name')} />
        <ColorPicker value={color} onChange={setColor} />

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-text-primary">Statuses</label>
            <Button type="button" variant="ghost" size="sm" onClick={addStatus} icon={<Plus size={12} />}>
              Add
            </Button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {statuses.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="color"
                  value={s.color}
                  onChange={(e) => updateStatus(i, 'color', e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={s.name}
                  onChange={(e) => updateStatus(i, 'name', e.target.value)}
                  className="flex-1 bg-surface-tertiary border border-border-primary rounded-md px-2 py-1 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
                <button
                  type="button"
                  onClick={() => removeStatus(i)}
                  className="p-1 rounded text-text-muted hover:text-status-danger transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>Create List</Button>
        </div>
      </form>
    </Modal>
  )
}
