import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { useWorkspaceStore } from '@/store/workspaceStore'

const schema = z.object({ name: z.string().min(1, 'Name is required').max(50) })
type FormData = z.infer<typeof schema>

interface Props {
  spaceId: string
  onClose: () => void
}

export const CreateFolderModal: React.FC<Props> = ({ spaceId, onClose }) => {
  const createFolder = useWorkspaceStore((s) => s.createFolder)
  const [color, setColor] = useState('#f59e0b')
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setError(null)
    try {
      await createFolder(spaceId, { name: data.name, color })
      onClose()
    } catch {
      setError('Failed to create folder')
    }
  }

  return (
    <Modal isOpen onClose={onClose} title="Create Folder">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {error && <p className="text-sm text-status-danger">{error}</p>}
        <Input label="Folder Name" placeholder="Sprint 1" error={errors.name?.message} {...register('name')} />
        <ColorPicker value={color} onChange={setColor} />
        <div className="flex gap-2 justify-end pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>Create Folder</Button>
        </div>
      </form>
    </Modal>
  )
}
