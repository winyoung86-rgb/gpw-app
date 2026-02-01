import type { ItineraryRequest, ItineraryResponse } from '../types'

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL

export async function fetchItinerary(
  request: ItineraryRequest
): Promise<ItineraryResponse> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const text = await response.text()

    if (!text || text.trim() === '') {
      throw new Error(
        'No parties found for your selection. Try different dates or tags.'
      )
    }

    try {
      const parsed = JSON.parse(text)
      // Handle both array and object responses from n8n
      const result = Array.isArray(parsed) ? parsed[0] : parsed

      // Ensure required fields exist with defaults
      // Calculate total_cost from itinerary if not provided
      if (result.total_cost === undefined && result.itinerary) {
        result.total_cost = result.itinerary.reduce((total: number, day: { parties: Array<{ ticket_price?: string }> }) => {
          return total + day.parties.reduce((dayTotal: number, party: { ticket_price?: string }) => {
            const match = party.ticket_price?.match(/\$?(\d+)/)
            return dayTotal + (match ? parseInt(match[1], 10) : 0)
          }, 0)
        }, 0)
      }

      // Set all_parties to empty array if not provided (will be loaded from Supabase)
      if (!result.all_parties) {
        result.all_parties = []
      }

      return result
    } catch {
      throw new Error(`Invalid response from backend: ${text.substring(0, 100)}`)
    }
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.')
    }
    throw error
  }
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function parsePrice(priceString: string): number {
  if (!priceString || priceString === 'Free' || priceString === 'Door Only') {
    return 0
  }
  const match = priceString.match(/\$?(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}
