/**
 * SearchBar Component
 * Barra di ricerca con autocomplete multilingua ibrida per Magic: The Gathering
 * Aggiornato secondo la nuova struttura API autocomplete con ricerca ibrida
 */

import { useState, useEffect, useRef, KeyboardEvent, useCallback } from 'react'
import { Search, Loader2, X, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useHybridAutocomplete } from '@/hooks/useHybridAutocomplete'
import { useLanguage, LANGUAGE_NAMES } from '@/contexts/LanguageContext'
import type { PrintingWithTranslation } from '@/hooks/useHybridAutocomplete'

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false)
  
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const langDropdownRef = useRef<HTMLDivElement>(null)

  // Usa il LanguageContext
  const { selectedLang, setSelectedLang, availableLangs, isLangLoading, fuseDictionary, idToPreferredName } = useLanguage()

  // Usa il nuovo hook per autocomplete ibrido con debounce ottimizzato
  const { results, loading, error, cached, translatedName } = useHybridAutocomplete(searchQuery, {
    debounceMs: 150, // Ottimizzato per velocità
    minLength: 2,
  })

  // Limita i risultati a 15 per performance
  const displayResults = results.slice(0, 15)
  const hasResults = displayResults.length > 0

  // Apri dropdown quando ci sono risultati
  useEffect(() => {
    if (hasResults && searchQuery.length >= 2) {
      setIsOpen(true)
    }
  }, [hasResults, searchQuery])

  // Gestione ricerca principale con logica ibrida Fuse.js
  const handleSearch = useCallback((query?: string) => {
    const searchTerm = query || searchQuery.trim()
    if (!searchTerm || searchTerm.length < 2) return

    setIsOpen(false)
    setActiveIndex(-1)

    // SE LA LINGUA È INGLESE (O NON C'È FUZZY) -> USA LA RICERCA NORMALE
    if (selectedLang === 'en' || !fuseDictionary) {
      navigate(`/search?term=${encodeURIComponent(searchTerm)}&lang=en`)
      return
    }

    // SE LA LINGUA È TRADOTTA -> USA LA LOGICA FUZZY
    const fuseResults = fuseDictionary.search(searchTerm, { limit: 20 })

    if (fuseResults.length === 0) {
      // FALLBACK: Non ho trovato traduzioni, cerco il termine in inglese
      console.log(`🔍 Nessun risultato fuzzy per "${searchTerm}" in ${selectedLang}, fallback a ricerca inglese`)
      navigate(`/search?term=${encodeURIComponent(searchTerm)}&lang=en`)
    } else {
      // TRADUZIONE RIUSCITA:
      // Estrai gli Oracle IDs unici
      const oracleIdsSet = new Set<string>()
      fuseResults.forEach(result => {
        oracleIdsSet.add(result.item.id)
      })
      const oracleIds = Array.from(oracleIdsSet).join(',')

      console.log(`✅ Trovati ${fuseResults.length} risultati fuzzy per "${searchTerm}" in ${selectedLang}`)
      console.log(`📋 Oracle IDs: ${oracleIds.substring(0, 100)}...`)

      // Naviga alla pagina risultati passando gli ID
      navigate(`/search?ids=${oracleIds}&lang=${selectedLang}&originalTerm=${encodeURIComponent(searchTerm)}`)
    }
  }, [searchQuery, navigate, selectedLang, fuseDictionary])

  // Gestione click su printing
  const handlePrintingClick = useCallback((printing: PrintingWithTranslation) => {
    console.log('🔍 Printing selezionato:', {
      oracle_id: printing.oracle_id,
      printing_id: printing.printing_id,
      name: printing.name,
      preferredName: printing.preferredName,
      originalName: printing.originalName,
    })

    if (printing.oracle_id && printing.printing_id) {
      // Passa sia oracle_id che printing_id come query parameter
      const url = `/card/${printing.oracle_id}?printing_id=${printing.printing_id}`
      console.log('🚀 Navigazione a:', url)
      navigate(url)
      setIsOpen(false)
      setSearchQuery('')
    } else if (printing.oracle_id) {
      // Fallback se printing_id non è disponibile
      const url = `/card/${printing.oracle_id}`
      console.log('🚀 Navigazione a (fallback):', url)
      navigate(url)
      setIsOpen(false)
      setSearchQuery('')
    }
  }, [navigate])

  // Gestione tasti
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (isOpen && activeIndex >= 0 && displayResults[activeIndex]) {
        handlePrintingClick(displayResults[activeIndex])
      } else {
        handleSearch()
      }
      return
    }

    if (!isOpen || displayResults.length === 0) {
      if (e.key === 'Escape') {
        setIsOpen(false)
        setActiveIndex(-1)
        inputRef.current?.blur()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(prev => Math.min(prev + 1, displayResults.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(prev => Math.max(prev - 1, -1))
        break
      case 'Escape':
        setIsOpen(false)
        setActiveIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Gestione click fuori per chiudere dropdown e lang selector
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      
      // Chiudi dropdown suggerimenti
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(target) &&
        inputRef.current &&
        !inputRef.current.contains(target)
      ) {
        setIsOpen(false)
        setActiveIndex(-1)
      }

      // Chiudi dropdown lingua
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(target)
      ) {
        setIsLangDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Gestione focus
  const handleFocus = () => {
    if (hasResults && searchQuery.length >= 2) {
      setIsOpen(true)
    }
  }

  // Gestione clear
  const handleClear = () => {
    setSearchQuery('')
    setActiveIndex(-1)
    setIsOpen(false)
    inputRef.current?.focus()
  }

  // Determina se mostrare il dropdown
  const showDropdown = isOpen && searchQuery.length >= 2 && (loading || hasResults || error)

  return (
    <div 
      className="w-full bg-white border-b border-gray-100 flex justify-center items-center py-3 sticky z-[999]"
      style={{
        top: '70px', // Subito sotto l'header fisso
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        overflow: 'visible', // Cambiato da 'hidden' a 'visible' per permettere al dropdown di essere visibile
      }}
    >
      <div className="w-[90%] max-w-[1100px] flex items-center gap-3 md:flex-row flex-col" style={{ position: 'relative', overflow: 'visible' }}>
        {/* Language Selector Dropdown */}
        <div className="relative" ref={langDropdownRef} style={{ zIndex: 1001, overflow: 'visible' }}>
          <button
            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 min-w-[120px] justify-between"
            disabled={isLangLoading}
          >
            <span>{LANGUAGE_NAMES[selectedLang] || selectedLang.toUpperCase()}</span>
            {isLangLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            ) : (
              <ChevronDown className={`w-4 h-4 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
            )}
          </button>

          {/* Language Dropdown Menu */}
          {isLangDropdownOpen && (
            <div 
              className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg min-w-[120px] max-h-60" 
              style={{ 
                position: 'absolute',
                zIndex: 1002,
                overflowY: 'auto',
                overflowX: 'visible'
              }}
            >
              {availableLangs.map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setSelectedLang(lang)
                    setIsLangDropdownOpen(false)
                    // Reset risultati quando cambia lingua
                    setIsOpen(false)
                    setActiveIndex(-1)
                  }}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    selectedLang === lang
                      ? 'bg-orange-50 text-orange-600 font-medium'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {LANGUAGE_NAMES[lang] || lang.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Input Container */}
        <div className="relative flex-1 md:w-auto w-full" style={{ zIndex: 1000 }}>
          <div 
            className="relative" 
            style={{ 
              padding: '0',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              placeholder="Cerca carte Magic: The Gathering..."
              className="w-full px-[18px] py-3 pr-20 text-[15px] border border-gray-300 
                       outline-none transition-all duration-200
                       focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20
                       placeholder-gray-400 bg-white"
              style={{
                border: '1px solid #d1d5db',
                outline: 'none',
                boxShadow: 'none',
                borderRadius: isOpen && hasResults ? '8px 8px 0 0' : '8px',
                borderBottom: isOpen && hasResults ? 'none' : '1px solid #d1d5db',
                marginBottom: isOpen && hasResults ? '0' : '0',
                backgroundColor: 'white',
              }}
              aria-label="Barra di ricerca carte Magic"
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              role="combobox"
              autoComplete="off"
            />

            {/* Loading indicator */}
            {loading && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
              </div>
            )}

            {/* Clear button */}
            {searchQuery && !loading && (
              <button
                onClick={handleClear}
                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Cancella ricerca"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Cache indicator */}
            {cached && searchQuery.length >= 2 && !loading && (
              <div className="absolute right-14 top-1/2 transform -translate-y-1/2 text-xs text-gray-400" title="Dati dalla cache">
                ⚡
              </div>
            )}

            {/* Search Button */}
            <button
              onClick={() => handleSearch()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 border-none rounded-lg w-8 h-8 
                       flex justify-center items-center cursor-pointer
                       transition-all duration-250 hover:bg-orange-600
                       hover:shadow-[0_4px_12px_rgba(255,165,0,0.3)]
                       focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              aria-label="Cerca carte"
            >
              <Search className="text-white text-sm" />
            </button>
          </div>

          {/* Mobile Overlay */}
          {showDropdown && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
              onClick={() => {
                setIsOpen(false)
                setActiveIndex(-1)
              }}
            />
          )}

          {/* Suggestions Dropdown */}
          {showDropdown && (
            <div
              ref={suggestionsRef}
              className="absolute z-50 w-full bg-white rounded-b-lg border-x border-b border-gray-200 shadow-lg max-h-96 overflow-y-auto
                       md:max-h-96 max-h-[60vh] md:relative md:mt-0 fixed md:static top-[120px] left-4 right-4 md:left-auto md:right-auto"
              style={{
                marginTop: '-1px',
                borderTop: 'none', // Rimuove completamente il bordo superiore
                top: '100%',
                left: '0',
                right: '0',
                maxHeight: '400px', // Limita l'altezza massima per non estendersi troppo
              }}
              role="listbox"
            >
              {error ? (
                <div className="px-4 py-3 text-sm text-red-600 border-b border-gray-100">
                  {error}
                </div>
              ) : loading ? (
                <div className="px-4 py-6 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                  <span className="ml-2 text-sm text-gray-500">Ricerca in corso...</span>
                </div>
              ) : hasResults ? (
                <div className="divide-y divide-gray-100">
                  {displayResults.map((printing, index) => {
                    const isActive = index === activeIndex
                    return (
                      <div
                        key={printing.printing_id}
                        onClick={() => handlePrintingClick(printing)}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                          isActive 
                            ? 'bg-orange-50 border-l-4 border-orange-500' 
                            : 'hover:bg-gray-50'
                        }`}
                        role="option"
                        aria-selected={isActive}
                      >
                        {/* Printing Image */}
                        <div className="flex-shrink-0">
                          {printing.image_uri_small ? (
                            <img
                              src={printing.image_uri_small}
                              alt={printing.name}
                              className="w-12 h-16 rounded object-cover border border-gray-200"
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                          ) : (
                            <div className="w-12 h-16 rounded bg-gray-100 border border-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-400">No Image</span>
                            </div>
                          )}
                        </div>

                        {/* Printing Info */}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {printing.preferredName || printing.name}
                          </div>
                          {printing.preferredName && printing.originalName && printing.originalName !== printing.preferredName && (
                            <div className="text-xs text-gray-400 truncate">
                              {printing.originalName}
                            </div>
                          )}
                          <div className="text-sm text-gray-500 truncate">
                            {printing.set_name} - #{printing.collector_number}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500">
                  Nessun risultato trovato per "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}