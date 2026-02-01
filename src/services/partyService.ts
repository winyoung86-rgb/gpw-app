import { supabase } from '../lib/supabase'
import type { Party } from '../types'

// Database row type from Supabase
interface PartyRow {
  id: string
  weekend_party: string
  date: string
  day: string
  party_name: string
  confirmed: string | null
  start_time: string | null
  end_time: string | null
  venue: string | null
  venue_address: string | null
  tags: string | null
  link: string | null
  instagram: string | null
  tickets_on_sale: string | null
  ticket_tier_1: string | null
  ticket_tier_2: string | null
  ticket_tier_3: string | null
  overall_scene: string | null
  recommended_outfits: string | null
  event_type: string | null
  vibe: string | null
  crowd: string | null
  timing: string | null
  dress_code: string | null
  music: string | null
  intensity: string | null
}

// Transform database row to frontend Party type
function transformPartyRow(row: PartyRow): Party {
  // Parse tags from comma-separated string to array
  const tagsArray = row.tags
    ? row.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : []

  // Determine ticket price (use first available tier)
  const ticketPrice = row.ticket_tier_1 || row.ticket_tier_2 || row.ticket_tier_3 || 'TBD'

  return {
    party_name: row.party_name,
    tags: tagsArray,
    start_time: row.start_time || '',
    end_time: row.end_time || '',
    venue: row.venue || '',
    ticket_price: ticketPrice,
    confirmed: row.confirmed || 'No',
    date: row.date,
    day: row.day,
    link: row.link || undefined,
  }
}

/**
 * Fetch all parties for a specific event/weekend
 */
export async function fetchPartiesByEvent(event: string): Promise<Party[]> {
  const { data, error } = await supabase
    .from('parties')
    .select('*')
    .eq('weekend_party', event)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch parties: ${error.message}`)
  }

  return (data as PartyRow[]).map(transformPartyRow)
}

/**
 * Fetch parties for a specific event within a date range
 */
export async function fetchPartiesByDateRange(
  event: string,
  startDate: Date,
  endDate: Date
): Promise<Party[]> {
  const startStr = startDate.toISOString().split('T')[0]
  const endStr = endDate.toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('parties')
    .select('*')
    .eq('weekend_party', event)
    .gte('date', startStr)
    .lte('date', endStr)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch parties: ${error.message}`)
  }

  return (data as PartyRow[]).map(transformPartyRow)
}

/**
 * Get unique weekend/event names from the database
 */
export async function fetchAvailableEvents(): Promise<string[]> {
  const { data, error } = await supabase
    .from('parties')
    .select('weekend_party')

  if (error) {
    throw new Error(`Failed to fetch events: ${error.message}`)
  }

  // Get unique values
  const unique = [...new Set((data as { weekend_party: string }[]).map((r) => r.weekend_party))]
  return unique.sort()
}
