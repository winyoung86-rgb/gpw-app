import { GlassCard, Select, Button } from '../../../shared/components/ui'
import { useWizardStore } from '../stores/wizardStore'
import { events } from '../data/events'

export function EventSelection() {
  const { selectedEvent, setSelectedEvent, nextStep } = useWizardStore()

  const eventOptions = events.map((event) => ({
    value: event.id,
    label: event.displayText,
  }))

  const handleEventChange = (eventId: string) => {
    const event = events.find((e) => e.id === eventId) || null
    setSelectedEvent(event)
  }

  const canProceed = selectedEvent !== null

  return (
    <div className="w-full max-w-md mx-auto">
      <GlassCard className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-purple via-pink to-orange bg-clip-text text-transparent">
            GAY PARTY WEEKEND!
          </h1>
          <p className="text-white">
            Boots polished? Harness packed? Let&apos;s plan this.
          </p>
        </div>

        {/* Event Selector */}
        <div className="mb-8">
          <Select
            options={eventOptions}
            placeholder="Where are we going, gorgeous?"
            value={selectedEvent?.id || ''}
            onChange={handleEventChange}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-end">
          <Button
            onClick={nextStep}
            disabled={!canProceed}
            variant="primary"
          >
            Next →
          </Button>
        </div>

        {/* Footer */}
        <p className="text-xs text-pink text-center mt-6">
          Developed by Winslow Y<br />@4the.win
        </p>
      </GlassCard>
    </div>
  )
}
