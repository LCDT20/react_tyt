/**
 * CardDetailPage
 * Pagina di dettaglio per una singola carta Magic: The Gathering
 */

import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Loader2, AlertCircle, Plus, Heart, Share2, Facebook, Twitter, Mail, ArrowLeftRight, Package, X, Upload } from 'lucide-react'
import { useCardDetail } from '@/hooks/useCardDetail'
import { useAuthStore } from '@/store/authStore'
import type { NavigationPrinting } from '@/types'

// Mappa codici lingua ai nomi visualizzati
const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  it: 'Italiano',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  pt: 'Português',
  ja: '日本語',
  ko: '한국어',
  ru: 'Русский',
  zh: '中文',
}

export default function CardDetailPage() {
  const { oracle_id } = useParams<{ oracle_id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const printingId = searchParams.get('printing_id')
  const { isAuthenticated } = useAuthStore()
  
  // Stato per la lingua selezionata (default: inglese)
  const [selectedLang, setSelectedLang] = useState<string>('en')
  const [activeTab, setActiveTab] = useState<'info' | 'sell' | 'wants'>('info')
  const [isCollectionModalOpen, setCollectionModalOpen] = useState(false)
  const [collectionForm, setCollectionForm] = useState({
    condition: 'NM',
    language: 'en',
    quantity: 1,
    price: '',
    notes: '',
    imageFile: null as File | null,
    isFoil: 'no',
  })
  
  const { cardInfo, selectedPrinting: initialSelectedPrinting, printings: allPrintings, loading, error, cached } = useCardDetail(
    oracle_id || '',
    { printingId }
  )

  // Determina la selectedPrinting basata sulla lingua selezionata (prima del filtro)
  const currentSelectedPrinting = useMemo(() => {
    if (printingId && allPrintings.length > 0) {
      const foundPrinting = allPrintings.find(p => p.id === printingId)
      if (foundPrinting) {
        return foundPrinting
      }
    }
    
    if (initialSelectedPrinting) {
      return initialSelectedPrinting
    }
    
    if (allPrintings.length > 0) {
      return allPrintings[0]
    }
    
    return null
  }, [printingId, allPrintings, initialSelectedPrinting])

  // Estrai le lingue disponibili SOLO per le printings dello stesso set della printing selezionata
  const availableLangs = useMemo(() => {
    if (!allPrintings || allPrintings.length === 0 || !currentSelectedPrinting) return ['en']
    
    const currentSetCode = currentSelectedPrinting.set_code
    
    const langs = new Set<string>()
    allPrintings.forEach(p => {
      if (p.set_code === currentSetCode) {
        const lang = p.lang || 'en'
        langs.add(lang)
      }
    })
    
    const sortedLangs = Array.from(langs).sort()
    return sortedLangs.length > 0 ? sortedLangs : ['en']
  }, [allPrintings, currentSelectedPrinting])

  // Filtra le printings in base alla lingua selezionata E allo stesso set della printing corrente
  const filteredPrintings = useMemo(() => {
    if (!allPrintings || allPrintings.length === 0 || !currentSelectedPrinting) return []
    
    const currentSetCode = currentSelectedPrinting.set_code
    
    return allPrintings.filter(p => {
      const printingLang = p.lang || 'en'
      return printingLang === selectedLang && p.set_code === currentSetCode
    })
  }, [allPrintings, selectedLang, currentSelectedPrinting])

  // Determina la selectedPrinting basata sulla lingua selezionata
  const selectedPrinting = useMemo(() => {
    if (printingId && filteredPrintings.length > 0) {
      const foundPrinting = filteredPrintings.find(p => p.id === printingId)
      if (foundPrinting) {
        return foundPrinting
      }
    }
    
    if (currentSelectedPrinting) {
      const currentLang = currentSelectedPrinting.lang || 'en'
      const currentSetCode = currentSelectedPrinting.set_code
      if (currentLang === selectedLang && currentSelectedPrinting.set_code === currentSetCode) {
        const stillExists = filteredPrintings.some(p => p.id === currentSelectedPrinting.id)
        if (stillExists) {
          return currentSelectedPrinting
        }
      }
    }
    
    if (filteredPrintings.length > 0) {
      return filteredPrintings[0]
    }
    
    return currentSelectedPrinting
  }, [printingId, filteredPrintings, currentSelectedPrinting, selectedLang])

  // Inizializza selectedLang quando arriva un printingId dalla URL
  useEffect(() => {
    if (initialSelectedPrinting && availableLangs.length > 0) {
      const printingLang = initialSelectedPrinting.lang || 'en'
      if (availableLangs.includes(printingLang) && printingLang !== selectedLang) {
        setSelectedLang(printingLang)
      }
    }
  }, [initialSelectedPrinting, availableLangs])

  // Aggiorna selectedLang quando cambiano le printings disponibili
  useEffect(() => {
    if (availableLangs.length > 0) {
      if (!availableLangs.includes(selectedLang)) {
        const newLang = availableLangs.includes('en') ? 'en' : availableLangs[0]
        setSelectedLang(newLang)
      }
      setCollectionForm((prev) => ({
        ...prev,
        language: availableLangs.includes(prev.language) ? prev.language : availableLangs.includes('en') ? 'en' : availableLangs[0],
      }))
    }
  }, [availableLangs, selectedLang])

  // Mantieni sincronizzata la lingua del form con la lingua selezionata
  useEffect(() => {
    setCollectionForm((prev) => ({
      ...prev,
      language: selectedLang,
    }))
  }, [selectedLang])

  const conditionOptions = [
    { value: 'NM', label: 'Near Mint (NM)' },
    { value: 'SP', label: 'Slightly Played (SP)' },
    { value: 'MP', label: 'Moderately Played (MP)' },
    { value: 'PL', label: 'Played (PL)' },
    { value: 'PO', label: 'Poor (PO)' },
  ]

  const handleCollectionInputChange = (field: 'condition' | 'language' | 'quantity' | 'price' | 'notes' | 'isFoil', value: string) => {
    setCollectionForm((prev) => ({
      ...prev,
      [field]: field === 'quantity' ? Math.max(1, parseInt(value || '1', 10)) : value,
    }))
  }

  const handleCollectionImageChange = (file: File | null) => {
    setCollectionForm((prev) => ({
      ...prev,
      imageFile: file,
    }))
  }

  const resetCollectionForm = () => {
    setCollectionForm({
      condition: 'NM',
      language: availableLangs.includes(selectedLang) ? selectedLang : availableLangs[0] || 'en',
      quantity: 1,
      price: '',
      notes: '',
      imageFile: null,
      isFoil: 'no',
    })
  }

  const openCollectionModal = () => {
    resetCollectionForm()
    setCollectionModalOpen(true)
  }

  const closeCollectionModal = () => {
    setCollectionModalOpen(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="card p-12 text-center">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Caricamento dettaglio carta...</p>
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

  if (!cardInfo) {
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

  const cardName = cardInfo.name || 'Carta Sconosciuta'
  const setName = selectedPrinting?.set_name || ''
  const cardType = cardInfo.type_line || ''
  const collectorNumber = selectedPrinting?.collector_number || ''
  const rarity = selectedPrinting?.rarity || ''
  const price = selectedPrinting?.eur ? parseFloat(selectedPrinting.eur).toFixed(2) : '0.00'
  const reprintsCount = allPrintings.length

  return (
    <>
      <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb e Support */}
        <div className="flex items-center justify-between mb-6">
          <nav className="text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-900 transition-colors">
              Prodotti (Magic: The Gathering)
          </Link>
          {' / '}
          <Link to="/search" className="hover:text-gray-900 transition-colors">
              Singles
            </Link>
            {setName && (
              <>
                {' / '}
                <Link to={`/set/${selectedPrinting?.set_code}`} className="hover:text-gray-900 transition-colors">
                  {setName}
                </Link>
              </>
            )}
            {' / '}
            <span className="text-gray-900">{cardName}</span>
          </nav>
          <Link to="/support" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <span>?</span>
            <span>Contattare il Support</span>
          </Link>
        </div>

        {/* Titolo Carta */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-orange-600 mb-1">{cardName}</h1>
          <p className="text-gray-500 text-sm">
            {setName && `${setName} - `}
            {cardType && `${cardType} - `}
            Singles
          </p>
        </div>

        {/* Pulsanti Azione Principali */}
        {isAuthenticated && (
          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-6 py-3 text-sm font-semibold transition-all duration-200 rounded-lg flex items-center gap-2 ${
                activeTab === 'info'
                  ? 'bg-orange-500 text-white shadow-md hover:bg-orange-600'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-400 hover:bg-orange-50'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              Scambiare
            </button>
          <button
              onClick={() => setActiveTab('sell')}
              className={`px-6 py-3 text-sm font-semibold transition-all duration-200 rounded-lg flex items-center gap-2 ${
                activeTab === 'sell'
                  ? 'bg-orange-500 text-white shadow-md hover:bg-orange-600'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-400 hover:bg-orange-50'
              }`}
          >
              <Plus className="w-4 h-4" />
              Vendere
          </button>
                  <button
              onClick={() => {
                setActiveTab('wants')
                openCollectionModal()
              }}
              className={`px-6 py-3 text-sm font-semibold transition-all duration-200 rounded-lg flex items-center gap-2 ${
                activeTab === 'wants'
                  ? 'bg-orange-500 text-white shadow-md hover:bg-orange-600'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                    }`}
                  >
              <Package className="w-4 h-4" />
              Collezione
                  </button>
            </div>
          )}

        {/* Layout a tre colonne */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Colonna Sinistra - Immagine Carta */}
          <div className="space-y-4">
            {/* Immagine Carta (più piccola) */}
            <div className="aspect-[488/680] max-w-xs mx-auto lg:mx-0 rounded-lg overflow-hidden bg-gray-100 shadow-md">
              {selectedPrinting?.image_uri_normal || selectedPrinting?.image_uri_small ? (
                <img
                  src={selectedPrinting.image_uri_normal || selectedPrinting.image_uri_small!}
                  alt={cardName}
                  className="w-full h-full object-cover"
                  key={selectedPrinting.id} // Force re-render quando cambia la printing
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-lg">Immagine non disponibile</span>
                </div>
              )}
            </div>

            {/* Selettori Lingua */}
            {availableLangs.length > 1 && (
              <div className="max-w-xs mx-auto lg:mx-0">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lingua disponibile:
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableLangs.map((lang) => {
                    // Trova la printing per questa lingua nello stesso set
                    const printingForLang = currentSelectedPrinting 
                      ? allPrintings.find(p => 
                          p.lang === lang && 
                          p.set_code === currentSelectedPrinting.set_code
                        )
                      : null

                    return (
                <button
                        key={lang}
                        onClick={() => {
                          setSelectedLang(lang)
                          // Aggiorna l'URL con il nuovo printing_id se disponibile
                          if (printingForLang && printingForLang.id !== printingId) {
                            navigate(`/card/${oracle_id}?printing_id=${printingForLang.id}`, { replace: true })
                          }
                        }}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                          selectedLang === lang
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                        }`}
                      >
                        {LANGUAGE_NAMES[lang] || lang.toUpperCase()}
                </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Colonna Centrale - Proprietà Carta */}
          <div className="space-y-4">
            {/* Proprietà Carta */}
            <div className="space-y-2 text-sm">
              {rarity && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium min-w-[100px]">Rarità:</span>
                  <span className="text-gray-900 capitalize">{rarity}</span>
                </div>
              )}
              {collectorNumber && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium min-w-[100px]">Numero:</span>
                  <span className="text-gray-900">{collectorNumber}</span>
                </div>
              )}
              {setName && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium min-w-[100px]">Stampata in:</span>
                  <Link
                    to={`/set/${selectedPrinting?.set_code}`}
                    className="text-orange-600 hover:text-orange-700 underline"
                  >
                    {setName}
                  </Link>
                  </div>
                )}
              {reprintsCount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium min-w-[100px]">Ristampe:</span>
                  <Link
                    to={`/card/${oracle_id}/printings`}
                    className="text-orange-600 hover:text-orange-700 underline"
                  >
                    Mostra le ristampe ({reprintsCount})
                  </Link>
                  </div>
                )}
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium min-w-[100px]">Articoli disponibili:</span>
                <span className="text-gray-900">2757</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium min-w-[100px]">Da:</span>
                <span className="text-gray-900 font-semibold">{price} €</span>
              </div>
            </div>

            {/* Pulsanti sotto le informazioni */}
            <div className="flex flex-col gap-2 pt-2">
              {reprintsCount > 0 && (
                <Link
                  to={`/card/${oracle_id}/printings`}
                  className="w-full bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 text-center border border-gray-200 hover:border-gray-300 hover:shadow-sm"
                >
                  Vedi le ristampe
                </Link>
              )}
              {selectedPrinting?.set_code && (
                <Link
                  to={`/set/${selectedPrinting.set_code}`}
                  className="w-full bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 text-center border border-gray-200 hover:border-gray-300 hover:shadow-sm"
                >
                  Vedi set completo
                </Link>
              )}
            </div>

            {/* Rules Text */}
            {cardInfo.oracle_text && (
              <div className="pt-3 border-t border-gray-200">
                <h3 className="text-base font-semibold text-gray-900 mb-2">Rules text</h3>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{cardInfo.oracle_text}</p>
              </div>
            )}
          </div>

          {/* Colonna Destra - Grafico, Prezzi, Azioni */}
          <div className="space-y-4">
            {/* Grafico Prezzo (Placeholder) */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Prezzo medio di vendita</h3>
              <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                <p className="text-gray-400 text-sm">Grafico placeholder</p>
              </div>
            </div>

            {/* Prezzi Medi */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                <span className="text-gray-600">Tendenza di prezzo:</span>
                <span className="font-semibold text-gray-900">0,64 €</span>
                  </div>
                  <div className="flex justify-between">
                <span className="text-gray-600">Prezzo medio 30 giorni:</span>
                <span className="font-semibold text-gray-900">0,55 €</span>
                  </div>
                  <div className="flex justify-between">
                <span className="text-gray-600">Prezzo medio 7 giorni:</span>
                <span className="font-semibold text-gray-900">0,62 €</span>
                  </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Prezzo medio 1 giorno:</span>
                <span className="font-semibold text-gray-900">0,57 €</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sezione Venditori (Placeholder) */}
        <div className="mt-6">
          <div className="bg-orange-500 text-white py-2.5 px-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Informazioni sul prodotto</h2>
              <span className="text-sm">Offerta</span>
            </div>
          </div>
          <div className="border border-gray-200 rounded-b-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Venditore
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Informazioni sul prodotto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Offerta
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Placeholder rows */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">Venditore {i}</span>
                        <span className="text-xs text-gray-500">1K</span>
      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">NM</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">0,{36 + i} €</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
    </div>
        </div>
      </div>
    </div>

      {/* Modal Collezione */}
      {isCollectionModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Aggiungi alla collezione</h2>
                <p className="text-sm text-gray-500">
                  {cardName} • {setName} {selectedPrinting?.collector_number ? `#${selectedPrinting.collector_number}` : ''}
                </p>
              </div>
              <button
                onClick={closeCollectionModal}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Chiudi modale collezione"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Condizione */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Condizione</label>
                  <div className="bg-gray-50 rounded-xl p-2 border border-gray-200">
                    <div className="grid grid-cols-1 gap-2">
                      {conditionOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleCollectionInputChange('condition', option.value)}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                            collectionForm.condition === option.value
                              ? 'bg-orange-500 text-white shadow-sm'
                              : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-400'
                          }`}
                          type="button"
                        >
                          <span>{option.label}</span>
                          {collectionForm.condition === option.value && <span className="text-xs uppercase">Scelta</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Lingua */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Lingua</label>
                  <div className="bg-white border border-gray-200 rounded-xl px-3 py-2.5">
                    <select
                      value={collectionForm.language}
                      onChange={(e) => handleCollectionInputChange('language', e.target.value)}
                      className="w-full bg-transparent text-sm text-gray-700 focus:outline-none"
                    >
                      {availableLangs.map((lang) => (
                        <option key={lang} value={lang}>
                          {LANGUAGE_NAMES[lang] || lang.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quantità */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Quantità</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCollectionInputChange('quantity', String(Math.max(1, collectionForm.quantity - 1)))}
                      className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={collectionForm.quantity}
                      onChange={(e) => handleCollectionInputChange('quantity', e.target.value)}
                      className="flex-1 h-10 text-center border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleCollectionInputChange('quantity', String(collectionForm.quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Prezzo */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Prezzo di acquisto (€)</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={collectionForm.price}
                    onChange={(e) => handleCollectionInputChange('price', e.target.value)}
                    placeholder="0,00"
                    className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                {/* Foil */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Foil</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleCollectionInputChange('isFoil', 'yes')}
                      className={`flex-1 h-10 rounded-xl border text-sm font-medium transition-all ${
                        collectionForm.isFoil === 'yes'
                          ? 'border-orange-500 bg-orange-50 text-orange-600'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-orange-400 hover:text-orange-500'
                      }`}
                    >
                      Sì
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCollectionInputChange('isFoil', 'no')}
                      className={`flex-1 h-10 rounded-xl border text-sm font-medium transition-all ${
                        collectionForm.isFoil === 'no'
                          ? 'border-orange-500 bg-orange-50 text-orange-600'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-orange-400 hover:text-orange-500'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="mt-5">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Note (opzionale)</label>
                <textarea
                  value={collectionForm.notes}
                  onChange={(e) => handleCollectionInputChange('notes', e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 resize-none"
                  placeholder="Aggiungi note su questa ristampa..."
                />
              </div>

              {/* Foto */}
              <div className="mt-5">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Foto</label>
                <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-300 rounded-2xl py-6 cursor-pointer hover:border-orange-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">Carica una foto</p>
                    <p className="text-xs text-gray-500">JPG, PNG fino a 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleCollectionImageChange(e.target.files ? e.target.files[0] : null)}
                  />
                </label>
                {collectionForm.imageFile && (
                  <p className="mt-2 text-xs text-gray-500">
                    Selezionata: <span className="font-medium text-gray-700">{collectionForm.imageFile.name}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50 rounded-b-2xl">
              <button
                onClick={closeCollectionModal}
                className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annulla
              </button>
              <button
                className="px-5 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg shadow-sm hover:bg-orange-600 transition-all"
              >
                Aggiungi alla collezione
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
