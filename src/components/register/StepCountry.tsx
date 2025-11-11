/**
 * StepCountry
 * Step 1: Selezione Paese con bandiera e prefissi
 */

import { useState, useEffect } from 'react'
import { useRegisterStore, COUNTRIES } from '@/store/registerStore'
import { ChevronDown, Search } from 'lucide-react'

export default function StepCountry() {
  const { 
    country, 
    setCountry, 
    errors, 
    clearError 
  } = useRegisterStore()
  
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<typeof COUNTRIES[0] | null>(null)

  // Find selected country
  useEffect(() => {
    if (country) {
      const found = COUNTRIES.find(c => c.code === country)
      setSelectedCountry(found || null)
    }
  }, [country])

  // Filter countries based on search
  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCountrySelect = (selectedCountry: typeof COUNTRIES[0]) => {
    setSelectedCountry(selectedCountry)
    setCountry(selectedCountry.code, selectedCountry.phone_prefix, selectedCountry.vat_prefix)
    setIsOpen(false)
    setSearchTerm('')
    clearError('country')
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setSearchTerm('')
    }
  }

  const hasError = errors.country && errors.country.length > 0

  return (
    <div className="max-w-md mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Seleziona il tuo paese
          </h3>
          <p className="text-gray-600">
            Questo determinerà il prefisso telefonico e il formato della P.IVA
          </p>
        </div>

        {/* Country Selector */}
        <div className="relative">
          <label htmlFor="country-select" className="block text-sm font-medium text-gray-700 mb-2">
            Paese *
          </label>
          
          <button
            type="button"
            onClick={handleToggle}
            className={`
              w-full px-4 py-3 text-left bg-white border rounded-xl shadow-sm transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
              ${hasError 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            role="combobox"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {selectedCountry ? (
                  <>
                    <span className="text-2xl">{selectedCountry.flag}</span>
                    <span className="text-gray-900">{selectedCountry.name}</span>
                    <span className="text-sm text-gray-500">({selectedCountry.code})</span>
                  </>
                ) : (
                  <span className="text-gray-500">Seleziona un paese...</span>
                )}
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`} 
              />
            </div>
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-hidden">
              {/* Search Input */}
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cerca paese..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    autoFocus
                  />
                </div>
              </div>

              {/* Countries List */}
              <div className="max-h-48 overflow-y-auto">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{country.flag}</span>
                        <div className="flex-1">
                          <div className="text-gray-900">{country.name}</div>
                          <div className="text-sm text-gray-500">
                            {country.phone_prefix} • {country.vat_prefix}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-center">
                    Nessun paese trovato
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {hasError && (
          <div className="text-red-600 text-sm mt-1" role="alert">
            {errors.country[0]}
          </div>
        )}

        {/* Selected Country Info */}
        {selectedCountry && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{selectedCountry.flag}</span>
              <div>
                <div className="font-medium text-gray-900">{selectedCountry.name}</div>
                <div className="text-sm text-gray-600">
                  Prefisso telefonico: <span className="font-mono">{selectedCountry.phone_prefix}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Prefisso P.IVA: <span className="font-mono">{selectedCountry.vat_prefix}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
