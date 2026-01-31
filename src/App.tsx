import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  EventSelection,
  TagSelection,
  DateSelection,
  LoadingState,
  useWizardStore,
} from './features/wizard'
import { ItineraryDisplay, AllPartiesDisplay } from './features/itinerary'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
})

function WizardRouter() {
  const currentStep = useWizardStore((state) => state.currentStep)

  const steps: Record<number, React.ReactNode> = {
    1: <EventSelection />,
    2: <TagSelection />,
    3: <DateSelection />,
    4: <LoadingState />,
    5: <ItineraryDisplay />,
    6: <AllPartiesDisplay />,
  }

  return <>{steps[currentStep]}</>
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        {/* Background gradient orbs for glass effect */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-32 w-96 h-96 bg-pink/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-orange/10 rounded-full blur-3xl" />
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
