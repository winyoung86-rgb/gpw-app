import type { Party } from '../../../types'

interface PartyCardProps {
  party: Party
  onRemove: () => void
}

export function PartyCard({ party, onRemove }: PartyCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-heading font-semibold text-lg pr-4">
          {party.party_name}
        </h4>
        <button
          type="button"
          onClick={onRemove}
          className="p-1 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
          aria-label="Remove party"
        >
          ✕
        </button>
      </div>

      {/* Description */}
      <p className="text-text-secondary text-sm mb-3">
        {party.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {party.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/20 gradient-tag-text font-medium"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div className="flex items-center gap-2 text-text-secondary">
          <span>⏱</span>
          <span>
            {party.start_time} - {party.end_time}
          </span>
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <span>📍</span>
          <span>{party.venue}</span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex justify-between items-center pt-3 border-t border-white/10">
        <span className="text-sm font-medium">
          🎫 {party.ticket_price || 'Free'}
        </span>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            party.confirmed === 'Confirmed'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-orange/20 text-orange'
          }`}
        >
          {party.confirmed === 'Confirmed' ? '✓ Confirmed' : '? Predicted'}
        </span>
      </div>
    </div>
  )
}
