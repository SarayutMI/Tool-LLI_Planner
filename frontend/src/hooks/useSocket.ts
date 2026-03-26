import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/store/authStore'
import { useTaskStore } from '@/store/taskStore'
import { useNotificationStore } from '@/store/notificationStore'
import type { Task, Notification } from '@/types'

export function useSocket() {
  const socketRef = useRef<Socket | null>(null)
  const accessToken = useAuthStore((s) => s.accessToken)
  const updateTaskInStore = useTaskStore((s) => s.updateTask)
  const addNotification = useNotificationStore((s) => s.addNotification)

  useEffect(() => {
    if (!accessToken) return

    const socket = io('/', {
      auth: { token: accessToken },
      transports: ['websocket'],
    })

    socketRef.current = socket

    socket.on('task:updated', (task: Task) => {
      updateTaskInStore(task.id, task)
    })

    socket.on('notification:new', (notification: Notification) => {
      addNotification(notification)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [accessToken, updateTaskInStore, addNotification])

  return socketRef.current
}
