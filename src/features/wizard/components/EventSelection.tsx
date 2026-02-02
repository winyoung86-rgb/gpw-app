import { GlassCard, Select, Button, Footer } from '../../../shared/components/ui'
import { useWizardStore } from '../stores/wizardStore'
import { events } from '../data/events'

export function EventSelection() {
  const { selectedEvent, setSelectedEvent, nextStep } = useWizardStore()

  const eventOptions = events.map((event) => ({
    value: event.id,
    label: event.displayText,
    labelShort: event.displayTextShort,
  }))

  const handleEventChange = (eventId: string) => {
    const event = events.find((e) => e.id === eventId) || null
    setSelectedEvent(event)
  }

  const canProceed = selectedEvent !== null

  return (
    <div className="w-full max-w-md mx-auto">
      <GlassCard className="p-10 md:p-12">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple via-pink to-orange bg-clip-text text-transparent neon-glow">
            GAY PARTY WEEKEND!
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-white text-center mb-6">
          Boots polished? Harness packed? Let&apos;s plan this.
        </p>

        {/* Event Selector */}
        <div className="mb-6">
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

        <Footer />
      </GlassCard>
    </div>
  )
}
