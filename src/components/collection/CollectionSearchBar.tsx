/**
 * CollectionSearchBar Component
 * Barra di ricerca per la collezione con debounce
 */

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'

interface CollectionSearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  debounceMs?: number
}

export default function CollectionSearchBar({
  searchQuery,
  onSearchChange,
  debounceMs = 500,
}: CollectionSearchBarProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    setLocalQuery(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout for debounced search
    timeoutRef.current = setTimeout(() => {
      if (localQuery !== searchQuery) {
        onSearchChange(localQuery)
      }
    }, debounceMs)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [localQuery, debounceMs, searchQuery, onSearchChange])

  const handleClear = () => {
    setLocalQuery('')
    onSearchChange('')
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Cerca nella tua collezione..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
        />
        {localQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cancella ricerca"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

