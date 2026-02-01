import { useState, useMemo, useEffect } from 'react'
import { GlassCard, Button } from '../../../shared/components/ui'
import { useWizardStore } from '../../wizard/stores/wizardStore'
import type { Party } from '../../../types'

// SVG Icons
const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const TicketIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

interface AllPartyCardProps {
  party: Party
  isInItinerary: boolean
  onAdd: () => void
}

function AllPartyCard({ party, isInItinerary, onAdd }: AllPartyCardProps) {
  return (
    <div className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 border transition-all ${
      isInItinerary
        ? 'border-green-500/50 bg-green-500/5'
        : 'border-white/10 hover:border-white/20'
    }`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-heading font-semibold text-lg pr-4">
          {party.party_name}
        </h4>
        {isInItinerary ? (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-green-500/20 text-green-400 flex-shrink-0">
            <CheckIcon />
            Added
          </span>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full bg-purple/20 text-purple hover:bg-purple/30 transition-colors flex-shrink-0 border border-purple/30"
          >
            <PlusIcon />
            Add
          </button>
        )}
      </div>

      {/* Tags */}
      {party.tags && party.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {party.tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/20 gradient-tag-text font-medium"
            >
              #{tag}
            </span>
          ))}
          {party.tags.length > 5 && (
            <span className="text-xs px-2 py-0.5 text-text-muted">
              +{party.tags.length - 5} more
            </span>
          )}
        </div>
      )}

      {/* Details */}
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div className="flex items-center gap-2 text-text-secondary">
          <ClockIcon />
          <span>
            {party.start_time}{party.end_time ? ` - ${party.end_time}` : ''}
          </span>
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <LocationIcon />
          <span className="truncate">{party.venue}</span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex justify-between items-center pt-3 border-t border-white/10">
        <span className="text-sm font-medium flex items-center gap-2">
          <TicketIcon />
          {party.ticket_price || 'TBD'}
        </span>
        <div className="flex items-center gap-2">
          {party.link && (
            <a
              href={party.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
            >
              <span className="text-green-400">↗</span>
              <span className="text-white/90">Info</span>
            </a>
          )}
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              party.confirmed === 'Yes' || party.confirmed === 'Confirmed'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-orange/20 text-orange'
            }`}
          >
            {party.confirmed === 'Yes' || party.confirmed === 'Confirmed' ? '✓ Confirmed' : '? Predicted'}
          </span>
        </div>
      </div>
    </div>
  )
}

export function AllPartiesDisplay() {
  const {
    selectedEvent,
    allParties,
    itinerary,
    isLoading,
    error,
    setCurrentStep,
    addPartyToItinerary,
    loadAllParties
  } = useWizardStore()

  // Load parties from Supabase when component mounts
  useEffect(() => {
    if (selectedEvent && (!allParties || allParties.length === 0)) {
      loadAllParties()
    }
  }, [selectedEvent, allParties, loadAllParties])

  const [selectedDay, setSelectedDay] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'time' | 'name' | 'cost'>('time')

  // Get unique days from all parties
  const days = useMemo((): [string, string][] => {
    if (!allParties || allParties.length === 0) return []
    const uniqueDays = new Map<string, string>()
    allParties.forEach((party: Party) => {
      const key = party.date || party.day || 'unknown'
      if (!uniqueDays.has(key)) {
        uniqueDays.set(key, party.day || party.date || 'Unknown Day')
      }
    })
    // Sort by date
    return Array.from(uniqueDays.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [allParties])

  // Check if a party is in the itinerary
  const isPartyInItinerary = (partyName: string): boolean => {
    return itinerary.some((day) =>
      day.parties.some((p: Party) => p.party_name === partyName)
    )
  }

  // Count parties in itinerary
  const itineraryCount = useMemo((): number => {
    return itinerary.reduce((count: number, day) => count + day.parties.length, 0)
  }, [itinerary])

  // Filter and sort parties
  const filteredParties = useMemo(() => {
    if (!allParties || allParties.length === 0) return []
    let filtered = [...allParties]

    // Filter by day
    if (selectedDay !== 'all') {
      filtered = filtered.filter(
        (party) => (party.date || party.day) === selectedDay
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.party_name.localeCompare(b.party_name)
        case 'cost': {
          const priceA = parseInt(a.ticket_price?.match(/\d+/)?.[0] || '0', 10)
          const priceB = parseInt(b.ticket_price?.match(/\d+/)?.[0] || '0', 10)
          return priceA - priceB
        }
        case 'time':
        default: {
          // Sort by day first, then time
          const dayCompare = (a.date || a.day || '').localeCompare(b.date || b.day || '')
          if (dayCompare !== 0) return dayCompare
          return parseTime(a.start_time) - parseTime(b.start_time)
        }
      }
    })

    return filtered
  }, [allParties, selectedDay, sortBy])

  if (!selectedEvent) {
    return null
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <GlassCard className="p-6 md:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-purple via-pink to-orange bg-clip-text text-transparent">
              Loading Parties...
            </h2>
            <p className="text-text-secondary">
              {selectedEvent.name} • {selectedEvent.city}
            </p>
          </div>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple"></div>
          </div>
        </GlassCard>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <GlassCard className="p-6 md:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-red-400">
              Error Loading Parties
            </h2>
            <p className="text-text-secondary">
              {selectedEvent.name} • {selectedEvent.city}
            </p>
          </div>
          <div className="mb-6">
            <Button onClick={() => setCurrentStep(5)} variant="ghost">
              ← Back to Itinerary
            </Button>
          </div>
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={loadAllParties} variant="secondary">
              Try Again
            </Button>
          </div>
        </GlassCard>
      </div>
    )
  }

  if (!allParties || allParties.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <GlassCard className="p-6 md:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              All Parties
            </h2>
            <p className="text-text-secondary">
              {selectedEvent.name} • {selectedEvent.city}
            </p>
          </div>

          <div className="mb-6">
            <Button onClick={() => setCurrentStep(5)} variant="ghost">
              ← Back to Itinerary
            </Button>
          </div>

          <div className="text-center py-12">
            <p className="text-text-secondary text-lg">
              No parties available for this weekend yet.
            </p>
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <GlassCard className="p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-purple via-pink to-orange bg-clip-text text-transparent neon-glow">
            All Weekend Parties
          </h2>
          <p className="text-text-secondary">
            {selectedEvent.name} • {selectedEvent.city}
          </p>
          <p className="text-sm text-text-muted mt-1">
            {allParties.length} parties available • {itineraryCount} in your itinerary
          </p>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Button onClick={() => setCurrentStep(5)} variant="ghost">
            ← Back to Itinerary ({itineraryCount} parties)
          </Button>
        </div>

        {/* Day Tabs */}
        <div className="mb-4 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            <button
              type="button"
              onClick={() => setSelectedDay('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedDay === 'all'
                  ? 'bg-purple text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              All Days ({(allParties || []).length})
            </button>
            {days.map(([key, label]) => {
              const count = (allParties || []).filter(
                (p: Party) => (p.date || p.day) === key
              ).length
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDay(key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedDay === key
                      ? 'bg-purple text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {label} ({count})
                </button>
              )
            })}
          </div>
        </div>

        {/* Sort Controls */}
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm text-text-muted">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'time' | 'name' | 'cost')}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple"
          >
            <option value="time">Time</option>
            <option value="name">Name</option>
            <option value="cost">Cost</option>
          </select>
        </div>

        {/* Party Cards Grid */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {filteredParties.map((party) => (
            <AllPartyCard
              key={`${party.party_name}-${party.date || party.day}`}
              party={party}
              isInItinerary={isPartyInItinerary(party.party_name)}
              onAdd={() => addPartyToItinerary(party)}
            />
          ))}
        </div>

        {filteredParties.length === 0 && (
          <div className="text-center py-8">
            <p className="text-text-muted">No parties found for this day.</p>
          </div>
        )}

        {/* Footer */}
        <p className="text-xs text-pink text-center mt-6 footer-glow">
          Developed by Winslow Y<br />@4the.win
        </p>
      </GlassCard>
    </div>
  )
}

// Helper function to parse time for sorting
function parseTime(timeStr: string): number {
  if (!timeStr) return 0
  if (timeStr.toLowerCase() === 'close') return 1440

  const normalized = timeStr.toUpperCase().trim()
  const isPM = normalized.includes('PM')
  const isAM = normalized.includes('AM')

  const match = normalized.match(/(\d{1,2})(?::(\d{2}))?/)
  if (!match) return 0

  let hours = parseInt(match[1], 10)
  const minutes = match[2] ? parseInt(match[2], 10) : 0

  if (isPM && hours !== 12) hours += 12
  if (isAM && hours === 12) hours = 0

  return hours * 60 + minutes
}
