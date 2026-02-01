import { useState, useEffect, useCallback } from 'react'
import type { Party } from '../types'
import { fetchPartiesByEvent, fetchPartiesByDateRange } from '../services/partyService'

interface UsePartiesOptions {
  event: string
  startDate?: Date
  endDate?: Date
  enabled?: boolean
}

interface UsePartiesResult {
  parties: Party[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Custom hook to fetch parties from Supabase
 * Caches results and provides loading/error states
 */
export function useParties({
  event,
  startDate,
  endDate,
  enabled = true,
}: UsePartiesOptions): UsePartiesResult {
  const [parties, setParties] = useState<Party[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!event || !enabled) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      let data: Party[]

      if (startDate && endDate) {
        data = await fetchPartiesByDateRange(event, startDate, endDate)
      } else {
        data = await fetchPartiesByEvent(event)
      }

      setParties(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch parties'
      setError(message)
      setParties([])
    } finally {
      setIsLoading(false)
    }
  }, [event, startDate, endDate, enabled])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    parties,
    isLoading,
    error,
    refetch: fetchData,
  }
}
