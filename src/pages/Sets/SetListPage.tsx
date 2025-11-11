/**
 * SetListPage
 * Pagina per visualizzare la lista di tutti i set Magic: The Gathering
 */

import { useNavigate } from 'react-router-dom'
import { Loader2, AlertCircle } from 'lucide-react'
import { useSets } from '@/hooks/useSets'
import type { NavigationSet } from '@/types'

export default function SetListPage() {
  const { sets, loading, error, cached } = useSets()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="card p-12 text-center">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Caricamento set...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="card p-12 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Errore</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Set Magic: The Gathering
          </h1>
          <p className="text-gray-600">
            {sets.length} set disponibili
            {cached && <span className="ml-2 text-sm text-orange-600">⚡ Cache</span>}
          </p>
        </div>

        {/* Grid Set */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sets.map((set) => (
            <SetCard key={set.code} set={set} onClick={() => navigate(`/set/${set.code}`)} />
          ))}
        </div>
      </div>
    </div>
  )
}

function SetCard({ set, onClick }: { set: NavigationSet; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="card p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="flex flex-col items-center text-center">
        {set.icon_svg_uri ? (
          <img
            src={set.icon_svg_uri}
            alt={set.name}
            className="w-16 h-16 mb-4"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : (
          <div className="w-16 h-16 mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xs text-gray-500">{set.code.toUpperCase()}</span>
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{set.name}</h3>
        <p className="text-sm text-gray-500 mb-1">{set.code.toUpperCase()}</p>
        <p className="text-xs text-gray-400 mb-2">
          {new Date(set.release_date).toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
          {set.set_type}
        </span>
      </div>
    </div>
  )
}



