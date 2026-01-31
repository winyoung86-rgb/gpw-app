import { useState, useMemo } from 'react'

interface CalendarProps {
  selectedStart: Date | null
  selectedEnd: Date | null
  onSelectStart: (date: Date) => void
  onSelectEnd: (date: Date) => void
  eventStart: Date
  eventEnd: Date
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const startOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const endOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate())
  return dateOnly >= startOnly && dateOnly <= endOnly
}

function isEventDate(date: Date, eventStart: Date, eventEnd: Date): boolean {
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const startOnly = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate())
  const endOnly = new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate())
  return dateOnly >= startOnly && dateOnly <= endOnly
}

export function Calendar({
  selectedStart,
  selectedEnd,
  onSelectStart,
  onSelectEnd,
  eventStart,
  eventEnd,
}: CalendarProps) {
  const [viewDate, setViewDate] = useState(() => new Date(eventStart))
  const [selectingEnd, setSelectingEnd] = useState(false)

  const { year, month, days } = useMemo(() => {
    const y = viewDate.getFullYear()
    const m = viewDate.getMonth()
    const firstDay = new Date(y, m, 1).getDay()
    const daysInMonth = new Date(y, m + 1, 0).getDate()

    const calendarDays: (Date | null)[] = []

    // Add empty slots for days before the first of the month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null)
    }

    // Add all days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      calendarDays.push(new Date(y, m, d))
    }

    return { year: y, month: m, days: calendarDays }
  }, [viewDate])

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1))
  }

  const handleDateClick = (date: Date) => {
    if (!selectingEnd || !selectedStart) {
      onSelectStart(date)
      setSelectingEnd(true)
    } else {
      if (date < selectedStart) {
        // If clicking before start, reset and use as new start
        onSelectStart(date)
      } else {
        onSelectEnd(date)
        setSelectingEnd(false)
      }
    }
  }

  return (
    <div className="calendar-glass rounded-xl p-4 border border-white/10">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
        >
          ←
        </button>
        <span className="font-heading font-semibold text-lg">
          {MONTHS[month]} {year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
        >
          →
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-text-muted py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const isStart = selectedStart && isSameDay(date, selectedStart)
          const isEnd = selectedEnd && isSameDay(date, selectedEnd)
          const inRange = isInRange(date, selectedStart, selectedEnd)
          const isEvent = isEventDate(date, eventStart, eventEnd)

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => handleDateClick(date)}
              className={`
                aspect-square flex items-center justify-center
                text-sm font-medium rounded-lg
                transition-all duration-150 cursor-pointer
                ${isStart || isEnd ? 'bg-purple text-white date-selected-glow' : ''}
                ${inRange && !isStart && !isEnd ? 'bg-purple/30 text-white' : ''}
                ${isEvent && !isStart && !isEnd && !inRange ? 'bg-orange/30 text-white border border-orange/50' : ''}
                ${!isStart && !isEnd && !inRange && !isEvent ? 'text-white/70 hover:bg-white/10 hover:text-white' : ''}
              `}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10 text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-orange/30 border border-orange/50" />
          <span>Event dates</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-purple" />
          <span>Your dates</span>
        </div>
      </div>
    </div>
  )
}
