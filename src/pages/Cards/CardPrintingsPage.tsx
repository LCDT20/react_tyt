/**
 * CardPrintingsPage
 * Pagina per visualizzare tutte le ristampe di una carta
 */

import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { useCardPrintings } from '@/hooks/useCardPrintings'
import type { NavigationPrinting } from '@/types'

export default function CardPrintingsPage() {
  const { oracle_id } = useParams<{ oracle_id: string }>()
  const navigate = useNavigate()
  const { cardName, printings, loading, error, cached } = useCardPrintings(oracle_id || '')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="card p-12 text-center">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Caricamento ristampe...</p>
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

  if (!cardName) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="card p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Carta non trovata</h2>
            <p className="text-gray-600 mb-6">La carta richiesta non esiste o è stata rimossa.</p>
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
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          {' / '}
          <Link to="/search" className="hover:text-gray-900 transition-colors">
            Ricerca
          </Link>
          {' / '}
          <Link to={`/card/${oracle_id}`} className="hover:text-gray-900 transition-colors">
            {cardName}
          </Link>
          {' / '}
          <span className="text-gray-900">Ristampe</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <Link
            to={`/card/${oracle_id}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Torna al dettaglio carta</span>
          </Link>

          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Ristampe di {cardName}</h1>
            {cached && <span className="text-sm text-orange-600">⚡ Cache</span>}
          </div>
          <p className="text-gray-600">{printings.length} ristampe trovate</p>
        </div>

        {/* Griglia Ristampe */}
        {printings.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-gray-600">Nessuna ristampa trovata per questa carta</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {printings.map((printing) => (
              <PrintingCard
                key={printing.id}
                printing={printing}
                onClick={() => navigate(`/card/${oracle_id}?printing_id=${printing.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function PrintingCard({ printing, onClick }: { printing: NavigationPrinting; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="card p-3 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border border-gray-200"
    >
      {printing.image_uri_normal || printing.image_uri_small ? (
        <img
          src={printing.image_uri_normal || printing.image_uri_small!}
          alt={printing.printed_name}
          className="w-full rounded-lg mb-2"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      ) : (
        <div className="w-full aspect-[488/680] bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
          <span className="text-xs text-gray-400">📄</span>
        </div>
      )}
      <div className="text-center">
        <h3 className="text-sm font-medium text-gray-900 truncate mb-1">{printing.set_name}</h3>
        <p className="text-xs text-gray-500 mb-1">#{printing.collector_number}</p>
        <p className="text-xs text-gray-400 mb-2">
          {new Date(printing.release_date).toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'short',
          })}
        </p>
        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full capitalize mb-2 inline-block">
          {printing.rarity}
        </span>
        {printing.eur && (
          <div className="mt-2">
            <span className="text-sm font-semibold text-orange-600 block">
              €{parseFloat(printing.eur).toFixed(2)}
            </span>
            {printing.eur_foil && (
              <span className="text-xs text-gray-500 block mt-1">
                €{parseFloat(printing.eur_foil).toFixed(2)} foil
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}



