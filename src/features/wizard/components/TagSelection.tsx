import { GlassCard, Button, TagPill } from '../../../shared/components/ui'
import { useWizardStore } from '../stores/wizardStore'
import { tagCategories } from '../data/tags'
import type { TagCategory } from '../../../types'

const MIN_TAGS = 3

export function TagSelection() {
  const { selectedTags, toggleTag, nextStep, prevStep } = useWizardStore()

  const canProceed = selectedTags.length >= MIN_TAGS

  const categories = Object.keys(tagCategories) as TagCategory[]

  return (
    <div className="w-full max-w-lg mx-auto">
      <GlassCard className="p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            What&apos;s Your Vibe?
          </h2>
          <p className="text-text-secondary text-base md:text-lg">
            Be honest, babe. We don&apos;t judge... much.
          </p>
        </div>

        {/* Tag Counter */}
        <div className="text-center mb-6">
          <span
            className={`text-base md:text-lg font-medium ${
              canProceed ? 'text-purple' : 'text-text-muted'
            }`}
          >
            {selectedTags.length} tags selected (minimum {MIN_TAGS})
          </span>
        </div>

        {/* Tag Categories */}
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {tagCategories[category].map((tag) => (
                  <TagPill
                    key={tag}
                    tag={tag}
                    selected={selectedTags.includes(tag)}
                    onClick={() => toggleTag(tag)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
          <Button onClick={prevStep} variant="ghost">
            ← Back
          </Button>
          <Button onClick={nextStep} disabled={!canProceed} variant="primary">
            Next →
          </Button>
        </div>

        {/* Footer */}
        <p className="text-xs text-pink text-center mt-6">
          Developed by Winslow Y
        </p>
      </GlassCard>
    </div>
  )
}
