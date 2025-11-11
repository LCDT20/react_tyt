/**
 * SuccessPage
 * Pagina di successo per operazioni di autenticazione
 */

import { useLocation, Link } from 'react-router-dom'
import { CheckCircle, ArrowRight } from 'lucide-react'

export default function SuccessPage() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const type = params.get('type')

  const messages: Record<string, { title: string; description: string; action?: string }> = {
    login: {
      title: 'Accesso effettuato con successo!',
      description: 'Benvenuto! Ora puoi accedere a tutte le funzionalità della piattaforma.',
      action: 'Vai alla Dashboard'
    },
    register: {
      title: 'Registrazione completata!',
      description: 'Ti abbiamo inviato un\'email di verifica. Controlla la tua casella di posta e clicca sul link per attivare il tuo account.',
      action: 'Torna al Login'
    },
    verify: {
      title: 'Email verificata con successo!',
      description: 'Il tuo account è stato attivato. Ora puoi effettuare il login.',
      action: 'Effettua il Login'
    },
    reset: {
      title: 'Email di reset inviata!',
      description: 'Ti abbiamo inviato le istruzioni per reimpostare la password. Controlla la tua casella di posta.',
      action: 'Torna al Login'
    }
  }

  const currentMessage = messages[type || 'login'] || messages.login

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {currentMessage.title}
          </h1>
          <p className="text-gray-600 leading-relaxed">
            {currentMessage.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="space-y-4">
          {currentMessage.action && (
            <Link
              to={type === 'register' || type === 'verify' || type === 'reset' ? '/login' : '/dashboard'}
              className="btn-primary w-full flex items-center justify-center"
            >
              {currentMessage.action}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          )}
          
          <Link
            to="/"
            className="block text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Torna alla Home
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs text-blue-800 text-center">
            <strong>Hai bisogno di aiuto?</strong> Contatta il nostro supporto tecnico per assistenza.
          </p>
        </div>
      </div>
    </div>
  )
}

