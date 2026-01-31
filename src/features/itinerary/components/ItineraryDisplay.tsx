import { GlassCard, Button } from '../../../shared/components/ui'
import { useWizardStore } from '../../wizard/stores/wizardStore'
import { DaySection } from './DaySection'

export function ItineraryDisplay() {
  const {
    selectedEvent,
    selectedTags,
    vibeSummary,
    itinerary,
    totalCost,
    removeParty,
    reset,
    setCurrentStep,
  } = useWizardStore()

  if (!selectedEvent) {
    return null
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <GlassCard className="p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-purple via-pink to-orange bg-clip-text text-transparent neon-glow">
            Your Weekend, Served.
          </h2>
          <p className="text-text-secondary">
            {selectedEvent.name} • {selectedEvent.city}
          </p>
        </div>

        {/* Selected Tags */}
        <div className="mb-6">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-2">
            Selected Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-white/10 px-3 py-1 rounded-full border border-white/20 gradient-tag-text font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Vibe Summary */}
        {vibeSummary && (
          <div className="mb-6 p-4 vibe-quote-box rounded-xl italic text-white">
            "{vibeSummary}"
          </div>
        )}

        {/* Itinerary Days */}
        <div className="space-y-3 mb-6">
          {itinerary.map((day, dayIndex) => (
            <DaySection
              key={day.date}
              day={day}
              dayIndex={dayIndex}
              defaultExpanded={dayIndex === 0}
              onRemoveParty={removeParty}
            />
          ))}
        </div>

        {/* Total Cost */}
        <div className="cost-box-glass">
          <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl text-center">
            <p className="text-sm text-white/70 mb-1">Estimated Weekend Cost</p>
            <p className="text-2xl font-heading font-bold text-white">${totalCost}</p>
          </div>
        </div>

        {/* View All Parties Button */}
        <div className="view-parties-button-wrapper mb-6">
          <button
            type="button"
            onClick={() => setCurrentStep(6)}
            className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm text-white font-medium rounded-xl hover:bg-white/10 transition-all"
          >
            View All Weekend Parties
          </button>
        </div>

        {/* Tips */}
        <div className="mb-8 tips-glass">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-3">
            Tips
          </p>
          <ul className="space-y-2 text-sm text-white">
            <li>• Hydrate between venues, queen</li>
            <li>• Pack a spare harness—trust us</li>
            <li>• Download offline maps</li>
          </ul>
        </div>

        {/* Start Over */}
        <div className="pt-6 border-t border-white/10">
          <Button onClick={reset} variant="secondary" className="w-full">
            Start Over
          </Button>
        </div>

        {/* Footer */}
        <p className="text-xs text-pink text-center mt-6 footer-glow">
          Developed by Winslow Y<br />@4the.win
        </p>
      </GlassCard>
    </div>
  )
}
