import React from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MainContent } from './MainContent'

export const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />
        <MainContent />
      </div>
    </div>
  )
}
