import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  EventSelection,
  TagSelection,
  DateSelection,
  LoadingState,
  useWizardStore,
} from './features/wizard'
import { ItineraryDisplay, AllPartiesDisplay } from './features/itinerary'
import { trackPageView } from './utils/analytics'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
})

// Step indicator component
function StepIndicator({ currentStep }: { currentStep: number }) {
  // Only show for steps 1-3 (user-interactive steps), hide during loading and results
  if (currentStep > 3) return null

  const steps = [
    { num: 1, label: 'Event' },
    { num: 2, label: 'Vibe' },
    { num: 3, label: 'Dates' },
  ]

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((step, index) => (
        <div key={step.num} className="flex items-center">
          {/* Step dot */}
          <div
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
              transition-all duration-300
              ${
                currentStep === step.num
                  ? 'bg-purple text-white step-dot-active'
                  : currentStep > step.num
                    ? 'bg-pink/30 text-white border border-pink/50'
                    : 'bg-white/10 text-white/50 border border-white/20'
              }
            `}
          >
            {currentStep > step.num ? '✓' : step.num}
          </div>
          {/* Connector line */}
          {index < steps.length - 1 && (
            <div
              className={`
                w-8 h-0.5 mx-1 transition-all duration-300
                ${currentStep > step.num ? 'bg-gradient-to-r from-pink to-purple' : 'bg-white/20'}
              `}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// Map step numbers to page names for analytics
const stepPageNames: Record<number, string> = {
  1: '/event-selection',
  2: '/tag-selection',
  3: '/date-selection',
  4: '/loading',
  5: '/itinerary',
  6: '/all-parties',
}

function WizardRouter() {
  const currentStep = useWizardStore((state) => state.currentStep)

  // Track page views when step changes
  useEffect(() => {
    const pageName = stepPageNames[currentStep] || `/step-${currentStep}`
    trackPageView(pageName)
  }, [currentStep])

  const steps: Record<number, React.ReactNode> = {
    1: <EventSelection />,
    2: <TagSelection />,
    3: <DateSelection />,
    4: <LoadingState />,
    5: <ItineraryDisplay />,
    6: <AllPartiesDisplay />,
  }

  return (
    <div className="w-full">
      <StepIndicator currentStep={currentStep} />
      <div className="wizard-step-transition">
        {steps[currentStep]}
      </div>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        {/* Background gradient orbs for glass effect */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple/20 rounded-full blur-3xl blob-animate-1" />
          <div className="absolute top-1/2 -right-32 w-96 h-96 bg-pink/20 rounded-full blur-3xl blob-animate-2" />
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-orange/10 rounded-full blur-3xl blob-animate-3" />
        </div>

        {/* Main content */}
        <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 md:p-6">
          <WizardRouter />
        </main>
      </div>
    </QueryClientProvider>
  )
}

export default App
