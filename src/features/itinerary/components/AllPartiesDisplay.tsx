import { useState, useMemo, useEffect } from 'react'
import { GlassCard, Button, Footer } from '../../../shared/components/ui'
import { useWizardStore } from '../../wizard/stores/wizardStore'
import type { Party } from '../../../types'

// SVG Icons
const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const TicketIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const LinkIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
)

interface AllPartyCardProps {
  party: Party
  isInItinerary: boolean
  onAdd: () => void
}

function AllPartyCard({ party, isInItinerary, onAdd }: AllPartyCardProps) {
  return (
    <article className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 border transition-all ${
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
            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full bg-purple/20 text-white hover:bg-purple/30 transition-colors flex-shrink-0 border border-purple/30"
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
        <div className="flex items-center gap-2 text-text-secondary justify-end">
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
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 transition-colors"
            >
              <span className="text-green-400"><LinkIcon /></span>
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
            {party.confirmed === 'Yes' || party.confirmed === 'Confirmed' ? '✓ Confirmed' : 'Likely'}
          </span>
        </div>
      </div>
    </article>
  )
}

interface DaySectionProps {
  dayKey: string
  dayLabel: string
  parties: Party[]
  isPartyInItinerary: (partyName: string) => boolean
  onAddParty: (party: Party) => void
  defaultExpanded?: boolean
}

function DaySection({ dayKey, dayLabel, parties, isPartyInItinerary, onAddParty, defaultExpanded = false }: DaySectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  // Sort parties by time
  const sortedParties = useMemo(() => {
    return [...parties].sort((a, b) => parseTime(a.start_time) - parseTime(b.start_time))
  }, [parties])

  return (
    <section className="border border-white/10 rounded-xl overflow-hidden mb-3">
      {/* Day Header — accordion pattern: h3 provides outline, button provides interaction */}
      <h3 className="m-0 text-base font-normal">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          className={`w-full flex items-center justify-between p-4 hover:bg-white/10 transition-colors text-left cursor-pointer ${
            isExpanded ? 'day-header-expanded' : 'bg-white/5'
          }`}
        >
          <span className="flex items-center gap-3">
            <span className="text-lg text-white">{isExpanded ? '▼' : '▶'}</span>
            <span className="font-heading font-semibold text-white">{dayLabel}</span>
          </span>
          <span className="text-white/70 text-sm">{parties.length} parties</span>
        </button>
      </h3>

      {/* Parties List */}
      {isExpanded && (
        <div className="p-4 pt-0">
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            {sortedParties.map((party) => (
              <AllPartyCard
                key={`${party.party_name}-${dayKey}`}
                party={party}
                isInItinerary={isPartyInItinerary(party.party_name)}
                onAdd={() => onAddParty(party)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
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
    loadAllParties,
    cameFromStep1,
    setCameFromStep1,
  } = useWizardStore()

  const handleBack = () => {
    if (cameFromStep1) {
      setCameFromStep1(false)
      setCurrentStep(1)
    } else {
      setCurrentStep(5)
    }
  }

  // Load parties from Supabase when component mounts
  useEffect(() => {
    if (selectedEvent && (!allParties || allParties.length === 0)) {
      loadAllParties()
    }
  }, [selectedEvent, allParties, loadAllParties])

  // Group parties by day
  const partiesByDay = useMemo(() => {
    if (!allParties || allParties.length === 0) return []

    const groups = new Map<string, { label: string; parties: Party[] }>()

    allParties.forEach((party: Party) => {
      const key = party.date || party.day || 'unknown'
      const label = party.day || party.date || 'Unknown Day'

      if (!groups.has(key)) {
        groups.set(key, { label, parties: [] })
      }
      groups.get(key)!.parties.push(party)
    })

    // Sort by date and return as array
    return Array.from(groups.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, value]) => ({ key, ...value }))
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
            <Button onClick={handleBack} variant="ghost">
              {cameFromStep1 ? '← Back' : '← Back to Itinerary'}
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
            <Button onClick={handleBack} variant="ghost">
              {cameFromStep1 ? '← Back' : '← Back to Itinerary'}
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
          <Button onClick={handleBack} variant="ghost">
            {cameFromStep1 ? '← Back' : `← Back to Itinerary (${itineraryCount} parties)`}
          </Button>
        </div>

        {/* Add Parties Helper Text */}
        <div className="mb-4 text-center">
          <p className="text-xl text-purple font-medium">+ Add Parties to your itinerary</p>
        </div>

        {/* Day Sections */}
        <div className="mb-8">
          {partiesByDay.map((dayGroup, index) => (
            <DaySection
              key={dayGroup.key}
              dayKey={dayGroup.key}
              dayLabel={dayGroup.label}
              parties={dayGroup.parties}
              isPartyInItinerary={isPartyInItinerary}
              onAddParty={addPartyToItinerary}
              defaultExpanded={index === 0}
            />
          ))}
        </div>

        <Footer />
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
