/**
 * CardModal Component
 * Modale per aggiungere o modificare una carta nella collezione
 */

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { CollectionItem } from '@/types'

interface CardModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<CollectionItem>) => Promise<void>
  initialData?: CollectionItem | null
  mode: 'add' | 'edit'
}

export default function CardModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  mode 
}: CardModalProps) {
  const [formData, setFormData] = useState({
    card_id: '',
    quantity: 1,
    condition: 'NM' as CollectionItem['condition'],
    language: 'EN',
    is_foil: false,
    is_signed: false,
    is_altered: false,
    notes: '',
    source: 'manual' as 'manual' | 'cardtrader',
    cardtrader_id: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          card_id: initialData.card_id,
          quantity: initialData.quantity,
          condition: initialData.condition,
          language: initialData.language,
          is_foil: initialData.is_foil,
          is_signed: initialData.is_signed,
          is_altered: initialData.is_altered,
          notes: initialData.notes || '',
          source: initialData.source,
          cardtrader_id: initialData.cardtrader_id || '',
        })
      } else {
        // Reset form for add mode
        setFormData({
          card_id: '',
          quantity: 1,
          condition: 'NM',
          language: 'EN',
          is_foil: false,
          is_signed: false,
          is_altered: false,
          notes: '',
          source: 'manual',
          cardtrader_id: '',
        })
      }
      setError(null)
    }
  }, [isOpen, mode, initialData])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const submitData = {
        ...formData,
        cardtrader_id: formData.source === 'cardtrader' ? formData.cardtrader_id : null,
      }

      // Remove cardtrader_id if source is manual
      if (submitData.source === 'manual') {
        delete (submitData as any).cardtrader_id
      }

      await onSubmit(submitData)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Errore durante il salvataggio')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {mode === 'add' ? 'Aggiungi Carta' : 'Modifica Carta'}
            </h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Chiudi"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Card ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card ID (UUID) *
              </label>
              <input
                type="text"
                required
                value={formData.card_id}
                onChange={(e) => setFormData({ ...formData, card_id: e.target.value })}
                disabled={mode === 'edit'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none disabled:bg-gray-100"
                placeholder="Inserisci l'UUID della carta"
              />
              <p className="mt-1 text-xs text-gray-500">
                {mode === 'add' 
                  ? 'UUID della carta da aggiungere' 
                  : 'UUID non modificabile'}
              </p>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantità *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condizione *
              </label>
              <select
                required
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="NM">Near Mint (NM)</option>
                <option value="LP">Lightly Played (LP)</option>
                <option value="GD">Good (GD)</option>
                <option value="MP">Moderately Played (MP)</option>
                <option value="HP">Heavily Played (HP)</option>
                <option value="PO">Poor (PO)</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lingua *
              </label>
              <select
                required
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="EN">English</option>
                <option value="IT">Italiano</option>
                <option value="FR">Français</option>
                <option value="DE">Deutsch</option>
                <option value="ES">Español</option>
                <option value="PT">Português</option>
                <option value="RU">Русский</option>
                <option value="JA">日本語</option>
                <option value="ZH">中文</option>
              </select>
            </div>

            {/* Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fonte *
              </label>
              <select
                required
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="manual">Manuale</option>
                <option value="cardtrader">CardTrader</option>
              </select>
            </div>

            {/* CardTrader ID (if source is cardtrader) */}
            {formData.source === 'cardtrader' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CardTrader ID
                </label>
                <input
                  type="text"
                  value={formData.cardtrader_id}
                  onChange={(e) => setFormData({ ...formData, cardtrader_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="CardTrader ID (opzionale)"
                />
              </div>
            )}

            {/* Checkboxes */}
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_foil}
                  onChange={(e) => setFormData({ ...formData, is_foil: e.target.checked })}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-700">Foil</span>
              </label>
              
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_signed}
                  onChange={(e) => setFormData({ ...formData, is_signed: e.target.checked })}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-700">Firmata</span>
              </label>
              
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_altered}
                  onChange={(e) => setFormData({ ...formData, is_altered: e.target.checked })}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-700">Altered</span>
              </label>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Note aggiuntive (opzionale)"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annulla
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Salvataggio...' : (mode === 'add' ? 'Aggiungi' : 'Salva')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

