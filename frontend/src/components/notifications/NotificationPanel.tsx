import React, { useEffect } from 'react'
import { X, Bell, Check } from 'lucide-react'
import { useNotificationStore } from '@/store/notificationStore'
import { formatRelative } from '@/utils/helpers'

interface NotificationPanelProps {
  onClose: () => void
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const { notifications, isLoading, fetchNotifications, markRead, markAllRead } = useNotificationStore()

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  return (
    <div className="fixed top-14 right-0 w-96 bg-surface-secondary border-l border-b border-border-primary shadow-2xl z-50 flex flex-col max-h-[calc(100vh-56px)]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-primary flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-text-secondary" />
          <span className="text-sm font-semibold text-text-primary">Notifications</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="text-xs text-accent-blue-light hover:text-accent-blue transition-colors"
          >
            Mark all read
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-tertiary transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <p className="text-center py-8 text-text-muted text-sm">Loading...</p>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 text-text-muted">
            <Bell size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`flex items-start gap-3 px-4 py-3 border-b border-border-primary cursor-pointer hover:bg-surface-tertiary transition-colors ${
                !n.isRead ? 'bg-accent-blue/5' : ''
              }`}
            >
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.isRead ? 'bg-transparent' : 'bg-accent-blue'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary">{n.message}</p>
                <p className="text-xs text-text-muted mt-0.5">{formatRelative(n.createdAt)}</p>
              </div>
              {!n.isRead && (
                <button className="p-0.5 text-text-muted hover:text-text-primary">
                  <Check size={13} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
