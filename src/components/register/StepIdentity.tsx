/**
 * StepIdentity
 * Step 3: Dati identità (dinamico in base al tipo di account)
 */

import { useState, useEffect } from 'react'
import { useRegisterStore } from '@/store/registerStore'
import { User, Building2 } from 'lucide-react'

export default function StepIdentity() {
  const { 
    account_type,
    nome,
    cognome,
    ragione_sociale,
    piva,
    vat_prefix,
    setPersonalData,
    setBusinessData,
    errors,
    clearError
  } = useRegisterStore()

  const [personalForm, setPersonalForm] = useState({ nome: nome || '', cognome: cognome || '' })
  const [businessForm, setBusinessForm] = useState({ 
    ragione_sociale: ragione_sociale || '', 
    piva: piva || '' 
  })

  // Update form state when store changes
  useEffect(() => {
    setPersonalForm({ nome: nome || '', cognome: cognome || '' })
    setBusinessForm({ ragione_sociale: ragione_sociale || '', piva: piva || '' })
  }, [nome, cognome, ragione_sociale, piva])

  const handlePersonalChange = (field: 'nome' | 'cognome', value: string) => {
    setPersonalForm(prev => ({ ...prev, [field]: value }))
    clearError(field)
    // Salva immediatamente nello store quando l'utente digita
    if (field === 'nome') {
      setPersonalData(value.trim(), personalForm.cognome.trim())
    } else {
      setPersonalData(personalForm.nome.trim(), value.trim())
    }
  }

  const handleBusinessChange = (field: 'ragione_sociale' | 'piva', value: string) => {
    setBusinessForm(prev => ({ ...prev, [field]: value }))
    clearError(field)
    // Salva immediatamente nello store quando l'utente digita
    if (field === 'ragione_sociale') {
      setBusinessData(value.trim(), businessForm.piva.trim())
    } else {
      setBusinessData(businessForm.ragione_sociale.trim(), value.trim())
    }
  }

  const handlePersonalSubmit = () => {
    if (personalForm.nome.trim() && personalForm.cognome.trim()) {
      setPersonalData(personalForm.nome.trim(), personalForm.cognome.trim())
    }
  }

  const handleBusinessSubmit = () => {
    if (businessForm.ragione_sociale.trim() && businessForm.piva.trim()) {
      setBusinessData(businessForm.ragione_sociale.trim(), businessForm.piva.trim())
    }
  }

  const hasPersonalError = (field: 'nome' | 'cognome') => 
    errors[field] && errors[field].length > 0

  const hasBusinessError = (field: 'ragione_sociale' | 'piva') => 
    errors[field] && errors[field].length > 0

  if (account_type === 'personal') {
    return (
      <div className="max-w-md mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
              <User className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              I tuoi dati personali
            </h3>
            <p className="text-gray-600">
              Inserisci il tuo nome e cognome
            </p>
          </div>

          {/* Personal Form */}
          <div className="space-y-4">
            {/* Nome */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                Nome *
              </label>
              <input
                type="text"
                id="nome"
                value={personalForm.nome}
                onChange={(e) => handlePersonalChange('nome', e.target.value)}
                onBlur={handlePersonalSubmit}
                className={`
                  w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                  ${hasPersonalError('nome')
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                placeholder="Il tuo nome"
                autoComplete="given-name"
              />
              {hasPersonalError('nome') && (
                <div className="text-red-600 text-sm mt-1" role="alert">
                  {errors.nome[0]}
                </div>
              )}
            </div>

            {/* Cognome */}
            <div>
              <label htmlFor="cognome" className="block text-sm font-medium text-gray-700 mb-2">
                Cognome *
              </label>
              <input
                type="text"
                id="cognome"
                value={personalForm.cognome}
                onChange={(e) => handlePersonalChange('cognome', e.target.value)}
                onBlur={handlePersonalSubmit}
                className={`
                  w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                  ${hasPersonalError('cognome')
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                placeholder="Il tuo cognome"
                autoComplete="family-name"
              />
              {hasPersonalError('cognome') && (
                <div className="text-red-600 text-sm mt-1" role="alert">
                  {errors.cognome[0]}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Dati personali</p>
                <p>Questi dati saranno utilizzati per identificarti nella piattaforma e per le comunicazioni ufficiali.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (account_type === 'business') {
    return (
      <div className="max-w-md mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
              <Building2 className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Dati aziendali
            </h3>
            <p className="text-gray-600">
              Inserisci la ragione sociale e la P.IVA
            </p>
          </div>

          {/* Business Form */}
          <div className="space-y-4">
            {/* Ragione Sociale */}
            <div>
              <label htmlFor="ragione_sociale" className="block text-sm font-medium text-gray-700 mb-2">
                Ragione Sociale *
              </label>
              <input
                type="text"
                id="ragione_sociale"
                value={businessForm.ragione_sociale}
                onChange={(e) => handleBusinessChange('ragione_sociale', e.target.value)}
                onBlur={handleBusinessSubmit}
                className={`
                  w-full px-4 py-3 border rounded-xl shadow-sm transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                  ${hasBusinessError('ragione_sociale')
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                placeholder="Nome dell'azienda"
                autoComplete="organization"
              />
              {hasBusinessError('ragione_sociale') && (
                <div className="text-red-600 text-sm mt-1" role="alert">
                  {errors.ragione_sociale[0]}
                </div>
              )}
            </div>

            {/* P.IVA */}
            <div>
              <label htmlFor="piva" className="block text-sm font-medium text-gray-700 mb-2">
                Partita IVA *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm font-mono">{vat_prefix}</span>
                </div>
                <input
                  type="text"
                  id="piva"
                  value={businessForm.piva}
                  onChange={(e) => handleBusinessChange('piva', e.target.value)}
                  onBlur={handleBusinessSubmit}
                  className={`
                    w-full pl-12 pr-4 py-3 border rounded-xl shadow-sm transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                    ${hasBusinessError('piva')
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                  placeholder="12345678901"
                  autoComplete="off"
                />
              </div>
              {hasBusinessError('piva') && (
                <div className="text-red-600 text-sm mt-1" role="alert">
                  {errors.piva[0]}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Prefisso: {vat_prefix} (dal paese selezionato)
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Dati aziendali</p>
                <p>La P.IVA deve essere valida e corrispondere al paese selezionato. Verificheremo questi dati durante la registrazione.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
