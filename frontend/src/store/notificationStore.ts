import { create } from 'zustand'
import type { Notification } from '@/types'
import api from '@/api/axios'

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean

  fetchNotifications: () => Promise<void>
  markRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
  addNotification: (notification: Notification) => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true })
    try {
      const data = await api.get<Notification[]>('/notifications').then((r) => r.data)
      set({
        notifications: data,
        unreadCount: data.filter((n) => !n.isRead).length,
      })
    } catch {
      // ignore
    } finally {
      set({ isLoading: false })
    }
  },

  markRead: async (id) => {
    await api.patch(`/notifications/${id}/read`)
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      unreadCount: Math.max(0, s.unreadCount - 1),
    }))
  },

  markAllRead: async () => {
    await api.patch('/notifications/read-all')
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }))
  },

  addNotification: (notification) => {
    set((s) => ({
      notifications: [notification, ...s.notifications],
      unreadCount: notification.isRead ? s.unreadCount : s.unreadCount + 1,
    }))
    void get
  },
}))
