/**
 * StepAccount
 * Step 2: Selezione tipo di account (personale/business)
 */

import { useRegisterStore } from '@/store/registerStore'
import { User, Building2 } from 'lucide-react'

export default function StepAccount() {
  const { 
    account_type, 
    setAccountType, 
    errors, 
    clearError 
  } = useRegisterStore()

  const handleAccountTypeSelect = (type: 'personal' | 'business') => {
    setAccountType(type)
    clearError('account_type')
  }

  const hasError = errors.account_type && errors.account_type.length > 0

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Che tipo di account vuoi creare?
          </h3>
          <p className="text-gray-600">
            Scegli il tipo di account più adatto alle tue esigenze
          </p>
        </div>

        {/* Account Type Options */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Account */}
          <button
            type="button"
            onClick={() => handleAccountTypeSelect('personal')}
            className={`
              p-6 rounded-2xl border-2 transition-all duration-200 text-left
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
              ${account_type === 'personal'
                ? 'border-orange-500 bg-orange-50 shadow-lg shadow-orange-500/10'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }
            `}
          >
            <div className="flex items-start space-x-4">
              <div className={`
                p-3 rounded-xl transition-colors duration-200
                ${account_type === 'personal'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Account Personale
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  Perfetto per collezionisti e giocatori individuali
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Gestione collezione personale</li>
                  <li>• Scambi con altri utenti</li>
                  <li>• Accesso alla community</li>
                  <li>• Tracking prezzi carte</li>
                </ul>
              </div>
            </div>
            
            {/* Selected Indicator */}
            {account_type === 'personal' && (
              <div className="mt-4 flex items-center text-orange-600 text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Selezionato
              </div>
            )}
          </button>

          {/* Business Account */}
          <button
            type="button"
            onClick={() => handleAccountTypeSelect('business')}
            className={`
              p-6 rounded-2xl border-2 transition-all duration-200 text-left
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
              ${account_type === 'business'
                ? 'border-orange-500 bg-orange-50 shadow-lg shadow-orange-500/10'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }
            `}
          >
            <div className="flex items-start space-x-4">
              <div className={`
                p-3 rounded-xl transition-colors duration-200
                ${account_type === 'business'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Account Business
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  Ideale per negozi, rivenditori e aziende
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Gestione inventario professionale</li>
                  <li>• Strumenti di vendita avanzati</li>
                  <li>• Reportistica e analytics</li>
                  <li>• Supporto prioritario</li>
                </ul>
              </div>
            </div>
            
            {/* Selected Indicator */}
            {account_type === 'business' && (
              <div className="mt-4 flex items-center text-orange-600 text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Selezionato
              </div>
            )}
          </button>
        </div>

        {/* Error Message */}
        {hasError && (
          <div className="text-red-600 text-sm mt-2 text-center" role="alert">
            {errors.account_type[0]}
          </div>
        )}

        {/* Additional Info */}
        {account_type && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">
                  {account_type === 'personal' ? 'Account Personale' : 'Account Business'}
                </p>
                <p>
                  {account_type === 'personal' 
                    ? 'Potrai sempre aggiornare il tuo account a Business in seguito dalle impostazioni.'
                    : 'Dovrai fornire la ragione sociale e la P.IVA per completare la registrazione.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
