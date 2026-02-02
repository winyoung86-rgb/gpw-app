import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { GlassCard, Button, Footer } from '../../../shared/components/ui'
import { useWizardStore } from '../stores/wizardStore'
import { fetchItinerary, formatDate } from '../../../services/api'

const LOADING_SAYINGS = [
  'Consulting the Gay Elders...',
  'Scanning my Gay Database...',
  'Checking the circuit calendar...',
  'Calculating cover charges...',
  'Finding the hottest parties...',
  'Verifying vibes...',
  'Locating the nearest go-go dancer...',
  'Syncing with the queer cosmos...',
]

export function LoadingState() {
  const hasCalledApi = useRef(false)
  const [sayingIndex, setSayingIndex] = useState(0)
  const [fadeKey, setFadeKey] = useState(0)

  // Cycle through sayings every 2.5 seconds with fade animation
  useEffect(() => {
    const interval = setInterval(() => {
      setSayingIndex((prev) => (prev + 1) % LOADING_SAYINGS.length)
      setFadeKey((prev) => prev + 1) // Trigger re-animation
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const {
    selectedEvent,
    selectedTags,
    arrivalDate,
    departureDate,
    setResults,
    setCurrentStep,
    setIsLoading,
  } = useWizardStore()

  const mutation = useMutation({
    mutationFn: fetchItinerary,
    onSuccess: (data) => {
      setResults({
        vibeSummary: data.vibe_summary,
        itinerary: data.itinerary,
        allParties: data.all_parties,
        totalCost: data.total_cost,
      })
      setIsLoading(false)
      setCurrentStep(5)
    },
    onError: () => {
      setIsLoading(false)
    },
  })

  useEffect(() => {
    if (hasCalledApi.current) return
    if (selectedEvent && arrivalDate && departureDate) {
      hasCalledApi.current = true
      mutation.mutate({
        event: selectedEvent.name,
        selected_tags: selectedTags,
        arrival_date: formatDate(arrivalDate),
        departure_date: formatDate(departureDate),
      })
    }
  }, [selectedEvent, arrivalDate, departureDate, selectedTags, mutation])

  const handleRetry = () => {
    if (selectedEvent && arrivalDate && departureDate) {
      mutation.mutate({
        event: selectedEvent.name,
        selected_tags: selectedTags,
        arrival_date: formatDate(arrivalDate),
        departure_date: formatDate(departureDate),
      })
    }
  }

  const handleStartOver = () => {
    setIsLoading(false)
    setCurrentStep(1)
  }

  // Get error message
  const errorMessage = mutation.error instanceof Error
    ? mutation.error.message
    : mutation.error
      ? String(mutation.error)
      : 'Something went wrong'

  // Error state
  if (mutation.isError) {
    return (
      <div className="w-full max-w-md mx-auto">
        <GlassCard className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange/20 flex items-center justify-center">
              <span className="text-3xl">😬</span>
            </div>
            <h2 className="text-xl font-bold mb-2">Oops!</h2>
            <p className="text-text-secondary">
              Something went wrong curating your weekend.
            </p>
            <p className="text-sm text-orange mt-2 break-words">
              {errorMessage}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button onClick={handleRetry} variant="primary">
              Try Again
            </Button>
            <Button onClick={handleStartOver} variant="ghost">
              Start Over
            </Button>
          </div>
        </GlassCard>
      </div>
    )
  }

  // Loading state
  return (
    <div className="w-full max-w-md mx-auto">
      <GlassCard className="p-8 text-center relative overflow-hidden">
        {/* Floating Particles */}
        <div className="particle particle-1" style={{ top: '15%', left: '10%' }} />
        <div className="particle particle-2" style={{ top: '25%', right: '15%' }} />
        <div className="particle particle-3" style={{ bottom: '30%', left: '20%' }} />
        <div className="particle particle-4" style={{ bottom: '20%', right: '10%' }} />
        <div className="particle particle-1" style={{ top: '40%', right: '25%' }} />
        <div className="particle particle-2" style={{ bottom: '40%', left: '30%' }} />

        <div className="flex flex-col items-center relative z-10">
          {/* Dual Spinner with Glow */}
          <div className="relative w-20 h-20 mb-6 spinner-glow">
            {/* Outer ring - spins reverse, pink */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink spin-reverse" />
            {/* Middle static ring */}
            <div className="absolute inset-2 rounded-full border-4 border-white/10" />
            {/* Inner ring - spins forward, purple */}
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-purple animate-spin" />
          </div>

          <h2
            key={fadeKey}
            className="text-xl font-bold mb-2 neon-glow loading-text-fade"
          >
            {LOADING_SAYINGS[sayingIndex]}
          </h2>
          <p className="text-text-secondary text-sm">
            Finding the hottest parties, verifying vibes, and calculating cover charges.
          </p>
        </div>

        <Footer />
      </GlassCard>
    </div>
  )
}
