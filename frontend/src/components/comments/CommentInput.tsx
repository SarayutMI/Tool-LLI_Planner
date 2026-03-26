import React, { useState } from 'react'
import { Send } from 'lucide-react'
import * as commentApi from '@/api/comment.api'

interface CommentInputProps {
  taskId: string
  onCommentAdded?: () => void
}

export const CommentInput: React.FC<CommentInputProps> = ({ taskId, onCommentAdded }) => {
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)
    try {
      await commentApi.addComment(taskId, { content: content.trim() })
      setContent('')
      onCommentAdded?.()
    } catch {
      // ignore
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        rows={2}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            void handleSubmit(e)
          }
        }}
        className="flex-1 bg-surface-secondary border border-border-primary rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue resize-none"
      />
      <button
        type="submit"
        disabled={!content.trim() || submitting}
        className="px-3 py-2 rounded-lg bg-accent-blue hover:bg-accent-blue-hover text-white text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end"
      >
        <Send size={15} />
      </button>
    </form>
  )
}
