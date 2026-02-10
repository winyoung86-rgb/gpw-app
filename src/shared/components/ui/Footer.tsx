import { Link, useLocation } from 'react-router-dom'
import { useWizardStore } from '../../../features/wizard/stores/wizardStore'
import { events } from '../../../features/wizard/data/events'

// Mock data for dev navigation to pages 5 & 6
const mockItinerary = [
  {
    date: '2026-09-25',
    day_label: 'Thursday',
    day_number: 1,
    parties: [
      {
        party_name: 'Magnitude',
        description: 'Opening party',
        tags: ['Circuit', 'EDM'],
        start_time: '10:00 PM',
        end_time: '4:00 AM',
        venue: 'The Midway',
        ticket_price: '$75',
        confirmed: 'Confirmed',
      },
    ],
  },
  {
    date: '2026-09-26',
    day_label: 'Friday',
    day_number: 2,
    parties: [
      {
        party_name: 'Brut',
        description: 'Leather party',
        tags: ['Leather', 'Fetish'],
        start_time: '9:00 PM',
        end_time: '3:00 AM',
        venue: 'DNA Lounge',
        ticket_price: '$50',
        confirmed: 'Confirmed',
      },
    ],
  },
]

const mockAllParties = [
  ...mockItinerary[0].parties,
  ...mockItinerary[1].parties,
  {
    party_name: 'Afterglow',
    description: 'Sunday recovery',
    tags: ['Chill', 'Day Party'],
    start_time: '2:00 PM',
    end_time: '8:00 PM',
    venue: 'El Rio',
    ticket_price: '$25',
    confirmed: 'Confirmed',
    date: '2026-09-27',
  },
]

export function Footer() {
  const setCurrentStep = useWizardStore((state) => state.setCurrentStep)
  const setSelectedEvent = useWizardStore((state) => state.setSelectedEvent)
  const setSelectedTags = useWizardStore((state) => state.setSelectedTags)
  const setResults = useWizardStore((state) => state.setResults)
  const currentStep = useWizardStore((state) => state.currentStep)
  const isDev = import.meta.env.DEV
  const location = useLocation()
  const isWizardRoute = location.pathname === '/'

  const handleDevNav = (step: number) => {
    // For steps 5 & 6, inject mock data so pages render
    if (step >= 5) {
      setSelectedEvent(events[5]) // Folsom
      setSelectedTags(['Circuit', 'Leather', 'EDM', 'Underground', 'Dark', 'Techno', 'Muscle', 'Bears', 'Harness', 'Jock'])
      setResults({
        vibeSummary: 'Get ready for a high-energy leather weekend!',
        itinerary: mockItinerary,
        allParties: mockAllParties,
        totalCost: 150,
      })
    }
    setCurrentStep(step)
  }

  return (
    <div className="text-center mt-8">
      {/* Dev Navigation Links — only on wizard route */}
      {isDev && isWizardRoute && (
        <div className="flex justify-center gap-2 mb-3">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <button
              key={step}
              onClick={() => handleDevNav(step)}
              className={`
                w-6 h-6 text-xs rounded
                transition-all duration-200
                ${currentStep === step
                  ? 'bg-purple text-white'
                  : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'
                }
              `}
            >
              {step}
            </button>
          ))}
        </div>
      )}

      {/* Original Footer */}
      <p className="text-xs text-pink footer-glow">
        Developed by{' '}
        <a
          href="https://winslowyoung.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white transition-colors"
        >
          Winslow Y
        </a>
        <br />
        @4the.win
      </p>

      {/* Contact link */}
      <Link
        to="/contact"
        className="inline-block mt-3 text-xs text-text-muted hover:text-white transition-colors"
      >
        Contact Us
      </Link>
    </div>
  );
}
