/**
 * Hook per recuperare solo le ristampe di una carta
 */

import { useState, useEffect } from 'react'
import { searchApiConfig } from '@/config/searchApi'
import type { CardPrintingsResponse, NavigationPrinting } from '@/types'

export function useCardPrintings(oracleId: string) {
  const [cardName, setCardName] = useState<string | null>(null)
  const [printings, setPrintings] = useState<NavigationPrinting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cached, setCached] = useState(false)

  useEffect(() => {
    if (!oracleId) {
      setLoading(false)
      return
    }

    async function fetchPrintings() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          searchApiConfig.endpoints.cardPrintings(oracleId),
          {
            headers: {
              'Accept': 'application/json',
            },
          }
        )

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Carta non trovata')
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: CardPrintingsResponse = await response.json()

        if (data.success && data.data) {
          setCardName(data.data.card_name)
          setPrintings(data.data.printings || [])
          setCached(data.cached || false)
        } else {
          throw new Error(data.error || 'Failed to fetch printings')
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching printings')
        setCardName(null)
        setPrintings([])
      } finally {
        setLoading(false)
      }
    }

    fetchPrintings()
  }, [oracleId])

  return { cardName, printings, loading, error, cached }
}

