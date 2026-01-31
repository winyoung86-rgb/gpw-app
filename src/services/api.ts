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
      return Array.isArray(parsed) ? parsed[0] : parsed
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
