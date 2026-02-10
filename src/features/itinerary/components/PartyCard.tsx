import type { Party } from '../../../types'

interface PartyCardProps {
  party: Party
  onRemove: () => void
}

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

const LinkIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
)

export function PartyCard({ party, onRemove }: PartyCardProps) {
  return (
    <article className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 party-card-glow">
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
          <ClockIcon />
          <span>
            {party.start_time} - {party.end_time}
          </span>
        </div>
        <div className="flex items-center gap-2 text-text-secondary justify-end">
          <LocationIcon />
          <span>{party.venue}</span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex justify-between items-center pt-3 border-t border-white/10">
        <span className="text-sm font-medium flex items-center gap-2">
          <TicketIcon />
          {party.ticket_price || 'Free'}
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
              party.confirmed === 'Confirmed'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-orange/20 text-orange'
            }`}
          >
            {party.confirmed === 'Confirmed' ? '✓ Confirmed' : 'Likely'}
          </span>
        </div>
      </div>
    </article>
  )
}
