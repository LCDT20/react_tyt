/**
 * Activity Status Banner Component
 * Banner arancione per mostrare lo stato "In Vacanza" (chiudibile e persistente)
 */

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useActivityStatusStore } from '@/store/activityStatusStore'

const BANNER_CLOSED_KEY = 'tyt_vacation_banner_closed'

export default function ActivityStatusBanner() {
  const { activityStatus } = useActivityStatusStore()
  const [isVisible, setIsVisible] = useState(true)

  // Carica lo stato di chiusura da localStorage
  useEffect(() => {
    if (activityStatus === 'vacanza') {
      const bannerClosed = localStorage.getItem(BANNER_CLOSED_KEY) === 'true'
      setIsVisible(!bannerClosed)
    } else {
      // Se non è più in vacanza, resetta lo stato
      setIsVisible(true)
      localStorage.removeItem(BANNER_CLOSED_KEY)
    }
  }, [activityStatus])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem(BANNER_CLOSED_KEY, 'true')
  }

  // Mostra il banner solo se lo stato è "vacanza" e non è stato chiuso
  if (activityStatus !== 'vacanza' || !isVisible) {
    return null
  }

  return (
    <div 
      className="w-full py-3 px-4 text-center text-white font-medium relative"
      style={{ backgroundColor: '#FFA500' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
        <span>In Vacanza</span>
        <button
          onClick={handleClose}
          className="ml-4 hover:bg-white/20 rounded-full p-1 transition-colors"
          aria-label="Chiudi banner"
          title="Chiudi"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

