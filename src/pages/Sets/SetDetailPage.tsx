/**
 * SetDetailPage
 * Pagina per visualizzare il dettaglio di un set con tutte le sue carte
 */

import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, AlertCircle, Search, X } from 'lucide-react'
import { useSetDetail } from '@/hooks/useSetDetail'
import type { NavigationPrinting } from '@/types'

export default function SetDetailPage() {
  const { setCode } = useParams<{ setCode: string }>()
  const navigate = useNavigate()
  const { setInfo, cards, loading, error, cached } = useSetDetail(setCode || '')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Filtra le carte in base alla ricerca
  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) {
      return cards
    }
    
    const query = searchQuery.toLowerCase().trim()
    return cards.filter((card) => {
      // Cerca nel nome stampato
      const matchesName = card.printed_name?.toLowerCase().includes(query)
      // Cerca nel nome standard (se disponibile)
      const matchesCardName = card.card_name?.toLowerCase().includes(query)
      // Cerca nel collector number
      const matchesCollectorNumber = card.collector_number?.toLowerCase().includes(query)
      // Cerca nella rarità
      const matchesRarity = card.rarity?.toLowerCase().includes(query)
      
      return matchesName || matchesCardName || matchesCollectorNumber || matchesRarity
    })
  }, [cards, searchQuery])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="card p-12 text-center">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Caricamento dettaglio set...</p>
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
            <p className="text-gray-600 mb-6">{error}</p>
            <button onClick={() => navigate(-1)} className="btn-primary">
              Torna indietro
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!setInfo) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="card p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Set non trovato</h2>
            <p className="text-gray-600 mb-6">Il set richiesto non esiste o è stato rimosso.</p>
            <button onClick={() => navigate(-1)} className="btn-primary">
              Torna indietro
            </button>
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
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Torna indietro</span>
          </button>

          <div className="flex items-center gap-6 mb-6">
            {setInfo.icon_svg_uri && (
              <img
                src={setInfo.icon_svg_uri}
                alt={setInfo.name}
                className="w-20 h-20"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{setInfo.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="font-medium">{setInfo.code.toUpperCase()}</span>
                <span>•</span>
                <span>
                  {new Date(setInfo.release_date).toLocaleDateString('it-IT', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span>•</span>
                <span className="capitalize">{setInfo.set_type}</span>
                {cached && <span className="ml-2 text-orange-600">⚡ Cache</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Barra di Ricerca */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca carte nel set..."
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-600">
              {filteredCards.length} di {cards.length} carte trovate
            </p>
          )}
        </div>

        {/* Cards Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Carte nel Set ({searchQuery ? filteredCards.length : cards.length})
          </h2>
          {filteredCards.length === 0 && searchQuery ? (
            <div className="card p-12 text-center">
              <p className="text-gray-600">Nessuna carta trovata per "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-orange-600 hover:text-orange-700 font-medium"
              >
                Cancella ricerca
              </button>
            </div>
          ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredCards.map((card) => (
              <CardTile
                key={card.id}
                card={card}
                  onClick={() => navigate(`/card/${card.oracle_id || card.card_oracle_id}?printing_id=${card.id}`)}
              />
            ))}
          </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CardTile({ card, onClick }: { card: NavigationPrinting; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="card p-3 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
    >
      {card.image_uri_normal || card.image_uri_small ? (
        <img
          src={card.image_uri_normal || card.image_uri_small!}
          alt={card.printed_name}
          className="w-full rounded-lg mb-2"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      ) : (
        <div className="w-full aspect-[488/680] bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
          <span className="text-xs text-gray-400">No Image</span>
        </div>
      )}
      <div className="text-center">
        <h3 className="text-sm font-medium text-gray-900 truncate mb-1" title={card.printed_name}>
          {card.printed_name}
        </h3>
        {card.card_name && card.card_name !== card.printed_name && (
          <p className="text-xs text-gray-400 italic truncate mb-1" title={card.card_name}>
            {card.card_name}
          </p>
        )}
        <p className="text-xs text-gray-500 mb-1">#{card.collector_number}</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded capitalize">
            {card.rarity}
          </span>
          {card.eur && (
            <span className="text-xs font-semibold text-orange-600">€{parseFloat(card.eur).toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  )
}

