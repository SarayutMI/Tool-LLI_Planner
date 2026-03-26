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
  workspaceId: string
  onClose: () => void
}

export const CreateSpaceModal: React.FC<Props> = ({ workspaceId, onClose }) => {
  const createSpace = useWorkspaceStore((s) => s.createSpace)
  const [color, setColor] = useState('#3b82f6')
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setError(null)
    try {
      await createSpace(workspaceId, { name: data.name, color, icon: data.icon })
      onClose()
    } catch {
      setError('Failed to create space')
    }
  }

  return (
    <Modal isOpen onClose={onClose} title="Create Space">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {error && <p className="text-sm text-status-danger">{error}</p>}
        <Input label="Space Name" placeholder="Engineering" error={errors.name?.message} {...register('name')} />
        <Input label="Icon (optional)" placeholder="⚙️" {...register('icon')} />
        <ColorPicker value={color} onChange={setColor} />
        <div className="flex gap-2 justify-end pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>Create Space</Button>
        </div>
      </form>
    </Modal>
  )
}
