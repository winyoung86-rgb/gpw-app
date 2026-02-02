import { useMemo, useEffect } from 'react'
import { GlassCard, Button, Footer } from '../../../shared/components/ui'
import { Calendar } from '../../../shared/components/ui/Calendar'
import { useWizardStore } from '../stores/wizardStore'

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Check if two date ranges overlap
function rangesOverlap(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  const s1 = new Date(start1.getFullYear(), start1.getMonth(), start1.getDate())
  const e1 = new Date(end1.getFullYear(), end1.getMonth(), end1.getDate())
  const s2 = new Date(start2.getFullYear(), start2.getMonth(), start2.getDate())
  const e2 = new Date(end2.getFullYear(), end2.getMonth(), end2.getDate())
  return s1 <= e2 && e1 >= s2
}

export function DateSelection() {
  const {
    selectedEvent,
    arrivalDate,
    departureDate,
    setArrivalDate,
    setDepartureDate,
    prevStep,
    setCurrentStep,
    setIsLoading,
  } = useWizardStore()

  const { eventStart, eventEnd } = useMemo(() => {
    if (!selectedEvent) {
      return {
        eventStart: new Date(),
        eventEnd: new Date(),
      }
    }

    const start = new Date(selectedEvent.startDate)
    const end = new Date(selectedEvent.endDate)

    return { eventStart: start, eventEnd: end }
  }, [selectedEvent])

  // Default to event dates when component mounts (if not already set)
  useEffect(() => {
    if (selectedEvent && !arrivalDate && !departureDate) {
      setArrivalDate(eventStart)
      setDepartureDate(eventEnd)
    }
  }, [selectedEvent, arrivalDate, departureDate, eventStart, eventEnd, setArrivalDate, setDepartureDate])

  // Validation: dates selected AND range overlaps with event dates
  const hasOverlap = useMemo(() => {
    if (!arrivalDate || !departureDate) return false
    return rangesOverlap(arrivalDate, departureDate, eventStart, eventEnd)
  }, [arrivalDate, departureDate, eventStart, eventEnd])

  const canProceed =
    arrivalDate !== null &&
    departureDate !== null &&
    arrivalDate < departureDate &&
    hasOverlap

  const handleBuildWeekend = () => {
    setIsLoading(true)
    setCurrentStep(4) // Go to loading state
  }

  if (!selectedEvent) {
    return null
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <GlassCard className="p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-purple via-pink to-orange bg-clip-text text-transparent neon-glow">
            When Are You In Town?
          </h2>
          <p className="text-text-secondary text-sm md:text-base">
            Arrive early, stay late. That&apos;s the gay way.
          </p>
        </div>

        {/* Event Info */}
        <div className="text-center mb-6 p-4 event-info-badge rounded-xl">
          <p className="font-heading font-semibold text-lg">
            {selectedEvent.name} — {selectedEvent.city}
          </p>
          <p className="text-text-secondary text-sm">
            {formatDisplayDate(eventStart)} – {formatDisplayDate(eventEnd)}
          </p>
        </div>

        {/* Calendar */}
        <div className="mb-6">
          <Calendar
            selectedStart={arrivalDate}
            selectedEnd={departureDate}
            onSelectStart={setArrivalDate}
            onSelectEnd={setDepartureDate}
            eventStart={eventStart}
            eventEnd={eventEnd}
          />
        </div>

        {/* Selected Dates Display */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="gradient-border-pink">
            <div className="p-3 bg-background rounded-[7px]">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                Arrival
              </p>
              <p className="font-medium">
                {arrivalDate ? formatDisplayDate(arrivalDate) : '—'}
              </p>
            </div>
          </div>
          <div className="gradient-border-purple">
            <div className="p-3 bg-background rounded-[7px]">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                Departure
              </p>
              <p className="font-medium">
                {departureDate ? formatDisplayDate(departureDate) : '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Validation Message */}
        {arrivalDate && departureDate && !hasOverlap && (
          <div className="mb-4 p-3 bg-orange/20 rounded-lg border border-orange/30 text-center">
            <p className="text-sm text-orange">
              Your dates must include at least one day during the event.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t border-white/10">
          <Button onClick={prevStep} variant="ghost">
            ← Back
          </Button>
          <Button
            onClick={handleBuildWeekend}
            disabled={!canProceed}
            variant="primary"
          >
            Build My Weekend →
          </Button>
        </div>

        <Footer />
      </GlassCard>
    </div>
  )
}
