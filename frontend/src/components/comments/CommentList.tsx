import React, { useEffect, useState } from 'react'
import * as commentApi from '@/api/comment.api'
import type { Comment } from '@/types'
import { Avatar } from '@/components/ui/Avatar'
import { formatRelative } from '@/utils/helpers'

interface CommentListProps {
  taskId: string
}

export const CommentList: React.FC<CommentListProps> = ({ taskId }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    commentApi.getComments(taskId)
      .then(setComments)
      .catch(() => setComments([]))
      .finally(() => setLoading(false))
  }, [taskId])

  if (loading) return <p className="text-xs text-text-muted">Loading comments...</p>
  if (comments.length === 0) return <p className="text-xs text-text-muted">No comments yet</p>

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <Avatar name={comment.author.name} src={comment.author.avatar} size="sm" className="flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-sm font-medium text-text-primary">{comment.author.name}</span>
              <span className="text-xs text-text-muted">{formatRelative(comment.createdAt)}</span>
            </div>
            <p className="text-sm text-text-secondary whitespace-pre-wrap">{comment.content}</p>
            {Object.keys(comment.reactions).length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(comment.reactions).map(([emoji, users]) => (
                  <button
                    key={emoji}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-tertiary border border-border-primary text-xs hover:border-accent-blue transition-colors"
                  >
                    <span>{emoji}</span>
                    <span className="text-text-muted">{users.length}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
