import { GlassCard, Select, Button, Footer } from '../../../shared/components/ui'
import { useWizardStore } from '../stores/wizardStore'
import { events } from '../data/events'

export function EventSelection() {
  const { selectedEvent, setSelectedEvent, nextStep, setCurrentStep, setCameFromStep1 } = useWizardStore()

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

  const handleSeeAllParties = () => {
    setCameFromStep1(true)
    setCurrentStep(6)
  }

  const handleGenerateSchedule = () => {
    setCameFromStep1(false)
    nextStep()
  }

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

        {/* Navigation - Two paths */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleSeeAllParties}
            disabled={!canProceed}
            variant="outline"
            className="flex-1"
          >
            See All Parties
          </Button>
          <Button
            onClick={handleGenerateSchedule}
            disabled={!canProceed}
            variant="primary"
            className="flex-1 btn-shimmer"
          >
            Create Agenda
          </Button>
        </div>

        <Footer />
      </GlassCard>
    </div>
  )
}
