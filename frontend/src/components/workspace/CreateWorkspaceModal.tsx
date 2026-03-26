import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { useWorkspaceStore } from '@/store/workspaceStore'

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  icon: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  onClose: () => void
}

export const CreateWorkspaceModal: React.FC<Props> = ({ onClose }) => {
  const createWorkspace = useWorkspaceStore((s) => s.createWorkspace)
  const setActiveWorkspace = useWorkspaceStore((s) => s.setActiveWorkspace)
  const [color, setColor] = useState('#0075ff')
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setError(null)
    try {
      const ws = await createWorkspace({ name: data.name, color, icon: data.icon })
      setActiveWorkspace(ws.id)
      onClose()
    } catch {
      setError('Failed to create workspace')
    }
  }

  return (
    <Modal isOpen onClose={onClose} title="Create Workspace">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {error && <p className="text-sm text-status-danger">{error}</p>}
        <Input label="Workspace Name" placeholder="My Workspace" error={errors.name?.message} {...register('name')} />
        <Input label="Icon (emoji or letter)" placeholder="🚀" {...register('icon')} />
        <ColorPicker value={color} onChange={setColor} />
        <div className="flex gap-2 justify-end pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>Create</Button>
        </div>
      </form>
    </Modal>
  )
}
