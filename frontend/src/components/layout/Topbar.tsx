import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutList, Columns, Calendar, Table2, Filter, Search, Bell, Settings, LogOut } from 'lucide-react'
import { useTasks } from '@/hooks/useTasks'
import { useAuth } from '@/hooks/useAuth'
import { useNotificationStore } from '@/store/notificationStore'
import { useWorkspace } from '@/hooks/useWorkspace'
import { ViewType } from '@/types'
import { Avatar } from '@/components/ui/Avatar'
import { Input } from '@/components/ui/Input'
import { NotificationPanel } from '@/components/notifications/NotificationPanel'
import { Dropdown } from '@/components/ui/Dropdown'

const viewButtons = [
  { type: ViewType.LIST, icon: LayoutList, label: 'List' },
  { type: ViewType.BOARD, icon: Columns, label: 'Board' },
  { type: ViewType.CALENDAR, icon: Calendar, label: 'Calendar' },
  { type: ViewType.TABLE, icon: Table2, label: 'Table' },
]

export const Topbar: React.FC = () => {
  const { viewType, setViewType } = useTasks()
  const { user, logout } = useAuth()
  const { lists } = useWorkspace()
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [search, setSearch] = useState('')

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="h-14 flex items-center gap-3 px-4 bg-surface-secondary border-b border-border-primary flex-shrink-0">
      <div className="flex items-center gap-1">
        {viewButtons.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => setViewType(type)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
              viewType === type
                ? 'bg-accent-blue/20 text-accent-blue-light border border-accent-blue/30'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-tertiary'
            }`}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      <div className="h-5 w-px bg-border-primary" />

      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-colors">
        <Filter size={14} />
        <span className="hidden sm:inline">Filter</span>
      </button>

      <div className="flex-1" />

      <div className="w-48 hidden md:block">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search size={14} />}
          className="py-1.5"
        />
      </div>

      <button
        onClick={() => setShowNotifications((v) => !v)}
        className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-colors"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent-blue rounded-full text-white text-xs flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {user && (
        <Dropdown
          trigger={<Avatar name={user.name} src={user.avatar} size="sm" className="cursor-pointer" />}
          items={[
            { label: 'Settings', icon: <Settings size={14} />, onClick: () => navigate('/settings') },
            { label: 'Sign Out', icon: <LogOut size={14} />, onClick: handleLogout, danger: true },
          ]}
          align="right"
        />
      )}

      {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
    </header>
  )
}
