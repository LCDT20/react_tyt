/**
 * CollectionDataTable Component
 * Tabella per visualizzare gli item della collezione
 */

import { useState } from 'react'
import { Edit, Trash2, Loader2, Image as ImageIcon } from 'lucide-react'
import type { CollectionItem } from '@/types'

interface CollectionDataTableProps {
  items: CollectionItem[]
  isLoading: boolean
  onEdit: (item: CollectionItem) => void
  onDelete: (item: CollectionItem) => void
}

export default function CollectionDataTable({ 
  items, 
  isLoading,
  onEdit, 
  onDelete 
}: CollectionDataTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (item: CollectionItem) => {
    if (window.confirm(`Sei sicuro di voler eliminare "${item.card_name}"?`)) {
      setDeletingId(item.id)
      try {
        await onDelete(item)
      } finally {
        setDeletingId(null)
      }
    }
  }

  const getConditionBadge = (condition: string) => {
    const colors = {
      NM: 'bg-green-100 text-green-800',
      LP: 'bg-blue-100 text-blue-800',
      GD: 'bg-yellow-100 text-yellow-800',
      MP: 'bg-orange-100 text-orange-800',
      HP: 'bg-red-100 text-red-800',
      PO: 'bg-gray-100 text-gray-800',
    }
    return colors[condition as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (isLoading && items.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Caricamento collezione...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 text-lg mb-2">Nessuna carta nella collezione</p>
        <p className="text-sm text-gray-500">
          Aggiungi la tua prima carta usando il pulsante "Aggiungi Carta"
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Carta
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Set
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lingua
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Condizione
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Foil
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantità
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fonte
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                {/* Card Image & Name */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-12 w-8 overflow-hidden rounded bg-gray-100 border border-gray-200">
                      {item.front_image_url ? (
                        <img
                          src={item.front_image_url}
                          alt={item.card_name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <span className="text-xs text-gray-400">No Img</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {item.card_name || item.card_id}
                      </div>
                      {item.is_signed && (
                        <div className="text-xs text-orange-600 font-medium">✓ Firmata</div>
                      )}
                      {item.is_altered && (
                        <div className="text-xs text-purple-600 font-medium">✓ Altered</div>
                      )}
                    </div>
                  </div>
                </td>
                
                {/* Set */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {item.set_name || '-'}
                  </div>
                </td>
                
                {/* Language */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {item.language}
                  </div>
                </td>
                
                {/* Condition */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionBadge(item.condition)}`}>
                    {item.condition}
                  </span>
                </td>
                
                {/* Foil */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {item.is_foil ? (
                      <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold rounded-full">
                        Foil
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                </td>
                
                {/* Quantity */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {item.quantity}
                  </div>
                </td>
                
                {/* Source */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {item.source === 'cardtrader' ? 'CardTrader' : 'Manuale'}
                  </div>
                </td>
                
                {/* Actions */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Modifica"
                      aria-label="Modifica"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={deletingId === item.id}
                      className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Elimina"
                      aria-label="Elimina"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

