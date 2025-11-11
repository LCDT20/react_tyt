/**
 * ErrorPage
 * Pagina di errore per operazioni di autenticazione
 */

import { useLocation, Link } from 'react-router-dom'
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'

export default function ErrorPage() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const type = params.get('type')

  const messages: Record<string, { title: string; description: string; action?: string }> = {
    login: {
      title: 'Errore di accesso',
      description: 'Credenziali non valide o account non verificato. Controlla email e password e riprova.',
      action: 'Riprova il Login'
    },
    register: {
      title: 'Registrazione non riuscita',
      description: 'Si è verificato un errore durante la registrazione. Email o username potrebbero essere già in uso.',
      action: 'Riprova la Registrazione'
    },
    verify: {
      title: 'Verifica email fallita',
      description: 'Il codice di verifica non è valido o è scaduto. Richiedi un nuovo codice di verifica.',
      action: 'Richiedi Nuovo Codice'
    },
    reset: {
      title: 'Reset password fallito',
      description: 'Si è verificato un errore durante l\'invio dell\'email di reset. Riprova più tardi.',
      action: 'Riprova il Reset'
    },
    network: {
      title: 'Errore di connessione',
      description: 'Impossibile connettersi al server. Verifica la tua connessione internet e riprova.',
      action: 'Riprova'
    }
  }

  const currentMessage = messages[type || 'login'] || messages.login

  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {currentMessage.title}
          </h1>
          <p className="text-gray-600 leading-relaxed">
            {currentMessage.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {currentMessage.action && (
            <button
              onClick={handleRetry}
              className="btn-primary w-full flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {currentMessage.action}
            </button>
          )}
          
          <div className="flex space-x-3">
            <Link
              to={type === 'register' ? '/register' : '/login'}
              className="flex-1 btn-secondary flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {type === 'register' ? 'Registrati' : 'Login'}
            </Link>
            
            <Link
              to="/"
              className="flex-1 btn-outline flex items-center justify-center"
            >
              Home
            </Link>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-xs text-red-800 text-center">
            <strong>Problema persistente?</strong> Contatta il supporto tecnico per assistenza immediata.
          </p>
        </div>

        {/* Debug Info (solo in sviluppo) */}
        {import.meta.env.DEV && (
          <div className="mt-4 bg-gray-100 border border-gray-300 rounded-xl p-3">
            <p className="text-xs text-gray-600 text-center">
              <strong>Debug:</strong> Tipo errore: {type || 'login'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

