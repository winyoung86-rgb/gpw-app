import { useState } from 'react'
import type { ItineraryDay } from '../../../types'
import { PartyCard } from './PartyCard'

interface DaySectionProps {
  day: ItineraryDay
  dayIndex: number
  defaultExpanded?: boolean
  onRemoveParty: (dayIndex: number, partyIndex: number) => void
}

export function DaySection({
  day,
  dayIndex,
  defaultExpanded = false,
  onRemoveParty,
}: DaySectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      {/* Day Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between p-4 hover:bg-white/10 transition-colors text-left cursor-pointer ${
          isExpanded ? 'day-header-expanded' : 'bg-white/5'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg text-white">{isExpanded ? '▼' : '▶'}</span>
          <span className="font-heading font-semibold text-white">{day.day_label}</span>
        </div>
        <span className="text-white text-sm">Day {day.day_number}</span>
      </button>

      {/* Parties */}
      {isExpanded && (
        <div className="p-4 space-y-3">
          {day.parties.length === 0 ? (
            <p className="text-text-muted text-center py-4">
              No parties scheduled for this day.
            </p>
          ) : (
            day.parties.map((party, partyIndex) => (
              <PartyCard
                key={`${party.party_name}-${partyIndex}`}
                party={party}
                onRemove={() => onRemoveParty(dayIndex, partyIndex)}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}
