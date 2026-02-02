// Event types
export interface Event {
  id: string
  name: string
  city: string
  startDate: string
  endDate: string
  displayText: string
  displayTextShort: string
}

// Tag types
export type TagCategory =
  | 'EVENT TYPE'
  | 'VIBE'
  | 'CROWD'
  | 'DRESS CODE'
  | 'MUSIC'
  | 'INTENSITY'

export type TagCategories = Record<TagCategory, string[]>

// Party types
export interface Party {
  party_name: string
  description?: string
  tags: string[]
  start_time: string
  end_time: string
  venue: string
  ticket_price: string
  confirmed: string // 'Confirmed', 'Predicted', 'Yes', 'Likely', etc.
  date?: string // YYYY-MM-DD format
  day?: string // "Sep 24 (Thu)" format from Google Sheets
  link?: string // URL to event/tickets
}

// Itinerary types
export interface ItineraryDay {
  date: string
  day_label: string
  day_number: number
  parties: Party[]
}

// API types
export interface ItineraryRequest {
  event: string
  selected_tags: string[]
  arrival_date: string
  departure_date: string
}

export interface ItineraryResponse {
  event: string
  selected_tags: string[]
  vibe_summary: string
  itinerary: ItineraryDay[]
  total_cost: number
  all_parties: Party[]
}

// Wizard state types
export interface WizardState {
  currentStep: number
  selectedEvent: Event | null
  selectedTags: string[]
  arrivalDate: Date | null
  departureDate: Date | null
}
