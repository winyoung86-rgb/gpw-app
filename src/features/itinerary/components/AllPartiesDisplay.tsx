import { GlassCard, Button } from '../../../shared/components/ui'
import { useWizardStore } from '../../wizard/stores/wizardStore'

export function AllPartiesDisplay() {
  const { selectedEvent, setCurrentStep } = useWizardStore()

  if (!selectedEvent) {
    return null
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <GlassCard className="p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            All Parties
          </h2>
          <p className="text-text-secondary">
            {selectedEvent.name} • {selectedEvent.city}
          </p>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => setCurrentStep(5)}
            variant="ghost"
          >
            ← Back to Itinerary
          </Button>
        </div>

        {/* Coming Soon Message */}
        <div className="text-center py-12 mb-8">
          <p className="text-text-secondary text-lg">
            This feature coming soon! Be patient Girl.
          </p>
        </div>

        {/* Footer */}
        <p className="text-xs text-pink text-center mt-6 footer-glow">
          Developed by Winslow Y<br />@4the.win
        </p>
      </GlassCard>
    </div>
  )
}
