import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { GlassCard, Button } from '../../../shared/components/ui'
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

  // Cycle through sayings every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSayingIndex((prev) => (prev + 1) % LOADING_SAYINGS.length)
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
      <GlassCard className="p-8 text-center">
        <div className="flex flex-col items-center">
          {/* Spinner */}
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-white/10" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple animate-spin" />
          </div>

          <h2 className="text-xl font-bold mb-2">
            {LOADING_SAYINGS[sayingIndex]}
          </h2>
          <p className="text-text-secondary text-sm">
            Finding the hottest parties, verifying vibes, and calculating cover charges.
          </p>
        </div>

        {/* Footer */}
        <p className="text-xs text-pink text-center mt-6">
          Developed by Winslow Y
        </p>
      </GlassCard>
    </div>
  )
}
