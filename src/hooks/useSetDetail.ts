/**
 * Hook per recuperare il dettaglio di un set con tutte le sue carte
 */

import { useState, useEffect } from 'react'
import { searchApiConfig } from '@/config/searchApi'
import type { SetDetailResponse, NavigationSet, NavigationPrinting } from '@/types'

export function useSetDetail(setCode: string) {
  const [setInfo, setSetInfo] = useState<NavigationSet | null>(null)
  const [cards, setCards] = useState<NavigationPrinting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cached, setCached] = useState(false)

  useEffect(() => {
    if (!setCode) {
      setLoading(false)
      return
    }

    async function fetchSetDetail() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(searchApiConfig.endpoints.set(setCode), {
          headers: {
            'Accept': 'application/json',
          },
        })

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Set not found')
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: SetDetailResponse = await response.json()

        if (data.success && data.data) {
          setSetInfo(data.data.set_info)
          setCards(data.data.cards || [])
          setCached(data.cached || false)
        } else {
          throw new Error(data.error || 'Failed to fetch set detail')
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching set detail')
        setSetInfo(null)
        setCards([])
      } finally {
        setLoading(false)
      }
    }

    fetchSetDetail()
  }, [setCode])

  return { setInfo, cards, loading, error, cached }
}



