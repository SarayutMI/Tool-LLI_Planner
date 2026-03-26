import React from 'react'
import { useTasks } from '@/hooks/useTasks'
import { ViewType } from '@/types'
import { ListView } from '@/components/views/ListView'
import { BoardView } from '@/components/views/BoardView'
import { CalendarView } from '@/components/views/CalendarView'
import { TableView } from '@/components/views/TableView'

export const MainContent: React.FC = () => {
  const { viewType } = useTasks()

  return (
    <main className="flex-1 overflow-hidden">
      {viewType === ViewType.LIST && <ListView />}
      {viewType === ViewType.BOARD && <BoardView />}
      {viewType === ViewType.CALENDAR && <CalendarView />}
      {viewType === ViewType.TABLE && <TableView />}
    </main>
  )
}
