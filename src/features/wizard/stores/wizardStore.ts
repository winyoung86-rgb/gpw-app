import { create } from 'zustand'
import type { Event, ItineraryDay, Party } from '../../../types'
import { fetchPartiesByEvent } from '../../../services/partyService'

// Helper to parse time strings like "10:00 PM", "10 PM", "22:00" to minutes since midnight
function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0

  // Handle "Close" or other non-time values
  if (timeStr.toLowerCase() === 'close' || !timeStr.match(/\d/)) {
    return 1440 // End of day
  }

  const normalized = timeStr.toUpperCase().trim()
  const isPM = normalized.includes('PM')
  const isAM = normalized.includes('AM')

  // Extract hours and minutes
  const match = normalized.match(/(\d{1,2})(?::(\d{2}))?/)
  if (!match) return 0

  let hours = parseInt(match[1], 10)
  const minutes = match[2] ? parseInt(match[2], 10) : 0

  // Convert to 24-hour format
  if (isPM && hours !== 12) hours += 12
  if (isAM && hours === 12) hours = 0

  return hours * 60 + minutes
}

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
  addPartyToItinerary: (party: Party) => void
  isPartyInItinerary: (partyName: string) => boolean

  // Loading/Error
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Supabase data loading
  loadAllParties: () => Promise<void>
  setAllParties: (parties: Party[]) => void

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

  addPartyToItinerary: (party) =>
    set((state) => {
      // Check if party is already in itinerary
      const alreadyExists = state.itinerary.some((day) =>
        day.parties.some((p) => p.party_name === party.party_name)
      )
      if (alreadyExists) return state

      const newItinerary = [...state.itinerary]

      // Find the day this party belongs to (by date or day string)
      const partyDate = party.date || ''
      const partyDay = party.day || ''

      let dayIndex = newItinerary.findIndex(
        (day) => day.date === partyDate || day.day_label === partyDay
      )

      // If day doesn't exist in itinerary, create it
      if (dayIndex === -1) {
        // Find the right position to insert (sorted by date)
        const newDay: import('../../../types').ItineraryDay = {
          date: partyDate,
          day_label: partyDay,
          day_number: newItinerary.length + 1,
          parties: [],
        }

        // Find insertion index to keep days sorted
        let insertIndex = newItinerary.length
        for (let i = 0; i < newItinerary.length; i++) {
          if (partyDate && newItinerary[i].date && partyDate < newItinerary[i].date) {
            insertIndex = i
            break
          }
        }

        newItinerary.splice(insertIndex, 0, newDay)
        dayIndex = insertIndex

        // Update day_numbers after insertion
        newItinerary.forEach((day, idx) => {
          day.day_number = idx + 1
        })
      }

      // Add party to the day
      const updatedParties = [...newItinerary[dayIndex].parties, party]

      // Sort parties by start time
      updatedParties.sort((a, b) => {
        const timeA = parseTimeToMinutes(a.start_time)
        const timeB = parseTimeToMinutes(b.start_time)
        return timeA - timeB
      })

      newItinerary[dayIndex] = {
        ...newItinerary[dayIndex],
        parties: updatedParties,
      }

      // Calculate price to add
      const priceMatch = party.ticket_price?.match(/\$?(\d+)/)
      const priceToAdd = priceMatch ? parseInt(priceMatch[1], 10) : 0

      return {
        itinerary: newItinerary,
        totalCost: state.totalCost + priceToAdd,
      }
    }),

  isPartyInItinerary: (_partyName: string): boolean => {
    // This is a derived getter - actual check is done in component
    // using the itinerary state directly since Zustand getters
    // can't easily access state within the store definition
    return false
  },

  // Loading/Error
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // Supabase data loading
  setAllParties: (parties) => set({ allParties: parties }),

  loadAllParties: async () => {
    const state = useWizardStore.getState()
    if (!state.selectedEvent) {
      return
    }

    set({ isLoading: true, error: null })

    try {
      const parties = await fetchPartiesByEvent(state.selectedEvent.name)
      set({ allParties: parties, isLoading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load parties'
      set({ error: message, isLoading: false })
    }
  },

  // Reset
  reset: () => set(initialState),
}))
