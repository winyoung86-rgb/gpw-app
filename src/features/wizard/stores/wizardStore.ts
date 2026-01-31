import { create } from 'zustand'
import type { Event, ItineraryDay, Party } from '../../../types'

interface WizardState {
  // Navigation
  currentStep: number

  // Step 1: Event
  selectedEvent: Event | null

  // Step 2: Tags
  selectedTags: string[]

  // Step 3: Dates
  arrivalDate: Date | null
  departureDate: Date | null

  // Step 5: Results
  vibeSummary: string
  itinerary: ItineraryDay[]
  allParties: Party[]
  totalCost: number

  // Loading/Error
  isLoading: boolean
  error: string | null
}

interface WizardActions {
  // Navigation
  setCurrentStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void

  // Step 1
  setSelectedEvent: (event: Event | null) => void

  // Step 2
  toggleTag: (tag: string) => void
  setSelectedTags: (tags: string[]) => void

  // Step 3
  setArrivalDate: (date: Date | null) => void
  setDepartureDate: (date: Date | null) => void

  // Step 5
  setResults: (data: {
    vibeSummary: string
    itinerary: ItineraryDay[]
    allParties: Party[]
    totalCost: number
  }) => void
  removeParty: (dayIndex: number, partyIndex: number) => void

  // Loading/Error
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Reset
  reset: () => void
}

const initialState: WizardState = {
  currentStep: 1,
  selectedEvent: null,
  selectedTags: [],
  arrivalDate: null,
  departureDate: null,
  vibeSummary: '',
  itinerary: [],
  allParties: [],
  totalCost: 0,
  isLoading: false,
  error: null,
}

export const useWizardStore = create<WizardState & WizardActions>((set) => ({
  ...initialState,

  // Navigation
  setCurrentStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 6) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

  // Step 1
  setSelectedEvent: (event) => set({ selectedEvent: event }),

  // Step 2
  toggleTag: (tag) =>
    set((state) => {
      const exists = state.selectedTags.includes(tag)
      return {
        selectedTags: exists
          ? state.selectedTags.filter((t) => t !== tag)
          : [...state.selectedTags, tag],
      }
    }),
  setSelectedTags: (tags) => set({ selectedTags: tags }),

  // Step 3
  setArrivalDate: (date) => set({ arrivalDate: date }),
  setDepartureDate: (date) => set({ departureDate: date }),

  // Step 5
  setResults: (data) =>
    set({
      vibeSummary: data.vibeSummary,
      itinerary: data.itinerary,
      allParties: data.allParties,
      totalCost: data.totalCost,
    }),

  removeParty: (dayIndex, partyIndex) =>
    set((state) => {
      const newItinerary = [...state.itinerary]
      const removedParty = newItinerary[dayIndex]?.parties[partyIndex]

      if (!removedParty) return state

      // Remove the party
      newItinerary[dayIndex] = {
        ...newItinerary[dayIndex],
        parties: newItinerary[dayIndex].parties.filter((_, i) => i !== partyIndex),
      }

      // Calculate price to subtract
      const priceMatch = removedParty.ticket_price?.match(/\$?(\d+)/)
      const priceToRemove = priceMatch ? parseInt(priceMatch[1], 10) : 0

      return {
        itinerary: newItinerary,
        totalCost: Math.max(0, state.totalCost - priceToRemove),
      }
    }),

  // Loading/Error
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // Reset
  reset: () => set(initialState),
}))
