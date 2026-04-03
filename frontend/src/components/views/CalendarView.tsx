import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  startOfMonth, endOfMonth, eachDayOfInterval,
  isSameMonth, isSameDay, format, addMonths, subMonths,
  startOfWeek, endOfWeek,
} from 'date-fns'
import { useTasks } from '@/hooks/useTasks'
import { TaskDetail } from '@/components/task/TaskDetail'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { tasks, setActiveTask, activeTask } = useTasks()

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calStart = startOfWeek(monthStart)
  const calEnd = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  const getTasksForDay = (day: Date) =>
    tasks.filter((t) => t.dueDate && isSameDay(new Date(t.dueDate), day))

  return (
    <div className="flex h-full">
      <div className={`flex-1 flex flex-col p-4 overflow-hidden ${activeTask ? 'mr-[672px]' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 rounded-lg hover:bg-surface-tertiary text-text-secondary hover:text-text-primary transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 text-sm rounded-lg hover:bg-surface-tertiary text-text-secondary hover:text-text-primary transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 rounded-lg hover:bg-surface-tertiary text-text-secondary hover:text-text-primary transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-border-primary rounded-lg overflow-hidden flex-1">
          {WEEKDAYS.map((d) => (
            <div key={d} className="bg-surface-secondary px-2 py-2 text-xs font-medium text-text-muted text-center">
              {d}
            </div>
          ))}
          {days.map((day) => {
            const dayTasks = getTasksForDay(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isToday = isSameDay(day, new Date())
            return (
              <div
                key={day.toISOString()}
                className={`bg-surface-secondary p-1.5 min-h-[80px] ${!isCurrentMonth ? 'opacity-40' : ''}`}
              >
                <div className={`w-6 h-6 flex items-center justify-center text-xs font-medium rounded-full mb-1 ${
                  isToday ? 'bg-accent-blue text-white' : 'text-text-secondary'
                }`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-0.5">
                  {dayTasks.slice(0, 3).map((task) => (
                    <button
                      key={task.id}
                      onClick={() => setActiveTask(task)}
                      className="w-full text-left px-1.5 py-0.5 rounded text-xs text-white truncate"
                      style={{ backgroundColor: '#0075ff' }}
                    >
                      {task.title}
                    </button>
                  ))}
                  {dayTasks.length > 3 && (
                    <p className="text-xs text-text-muted px-1">+{dayTasks.length - 3} more</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {activeTask && <TaskDetail />}
    </div>
  )
}
