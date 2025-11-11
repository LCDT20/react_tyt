/**
 * CollectionFilterSidebar Component
 * Sidebar per filtrare la collezione
 */

import { useState, useEffect } from 'react'
import { X, Filter } from 'lucide-react'
import type { CollectionFilters } from '@/types'

interface CollectionFilterSidebarProps {
  filters: CollectionFilters
  onFiltersChange: (filters: CollectionFilters) => void
  onClearFilters: () => void
}

export default function CollectionFilterSidebar({
  filters,
  onFiltersChange,
  onClearFilters,
}: CollectionFilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState<CollectionFilters>(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const conditions = ['NM', 'LP', 'GD', 'MP', 'HP', 'PO']
  const languages = ['EN', 'IT', 'FR', 'DE', 'ES', 'PT', 'RU', 'JA', 'ZH']
  const sources = ['manual', 'cardtrader']

  const handleConditionChange = (condition: string) => {
    const newConditions = localFilters.condition?.includes(condition)
      ? localFilters.condition.filter((c) => c !== condition)
      : [...(localFilters.condition || []), condition]
    
    setLocalFilters({ ...localFilters, condition: newConditions })
  }

  const handleLanguageChange = (language: string) => {
    const newLanguages = localFilters.language?.includes(language)
      ? localFilters.language.filter((l) => l !== language)
      : [...(localFilters.language || []), language]
    
    setLocalFilters({ ...localFilters, language: newLanguages })
  }

  const handleSourceChange = (source: string) => {
    const newSources = localFilters.source?.includes(source)
      ? localFilters.source.filter((s) => s !== source)
      : [...(localFilters.source || []), source]
    
    setLocalFilters({ ...localFilters, source: newSources })
  }

  const handleFoilChange = (value: boolean | null) => {
    setLocalFilters({ ...localFilters, is_foil: value })
  }

  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
  }

  const handleClearFilters = () => {
    const clearedFilters: CollectionFilters = {
      condition: [],
      language: [],
      is_foil: null,
      source: [],
    }
    setLocalFilters(clearedFilters)
    onClearFilters()
  }

  const hasActiveFilters = Boolean(
    (localFilters.condition && localFilters.condition.length > 0) ||
    (localFilters.language && localFilters.language.length > 0) ||
    localFilters.is_foil !== null ||
    (localFilters.source && localFilters.source.length > 0)
  )

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtri
        </h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Condition Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Condizione
          </label>
          <div className="space-y-2">
            {conditions.map((condition) => (
              <label key={condition} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={localFilters.condition?.includes(condition) || false}
                  onChange={() => handleConditionChange(condition)}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  {condition}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Language Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Lingua
          </label>
          <div className="space-y-2">
            {languages.map((language) => (
              <label key={language} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={localFilters.language?.includes(language) || false}
                  onChange={() => handleLanguageChange(language)}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  {language}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Foil Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Foil
          </label>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="foil"
                checked={localFilters.is_foil === true}
                onChange={() => handleFoilChange(true)}
                className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500 focus:ring-2 cursor-pointer"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                Solo Foil
              </span>
            </label>
            <label className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="foil"
                checked={localFilters.is_foil === false}
                onChange={() => handleFoilChange(false)}
                className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500 focus:ring-2 cursor-pointer"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                Solo Non-Foil
              </span>
            </label>
            <label className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="foil"
                checked={localFilters.is_foil === null}
                onChange={() => handleFoilChange(null)}
                className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500 focus:ring-2 cursor-pointer"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                Tutte
              </span>
            </label>
          </div>
        </div>

        {/* Source Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Fonte
          </label>
          <div className="space-y-2">
            {sources.map((source) => (
              <label key={source} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={localFilters.source?.includes(source) || false}
                  onChange={() => handleSourceChange(source)}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 capitalize">
                  {source === 'cardtrader' ? 'CardTrader' : 'Manuale'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Apply Button */}
        <button
          onClick={handleApplyFilters}
          className="w-full px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          Applica Filtri
        </button>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Resetta Filtri
          </button>
        )}
      </div>
    </div>
  )
}

