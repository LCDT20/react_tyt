/**
 * AccountSecurityPage Component
 * Security settings page with Two-Factor Authentication
 */

import { AlertTriangle } from 'lucide-react'

export default function AccountSecurityPage() {
  const is2FAEnabled = false

  return (
    <div className="space-y-6">
      {/* Help Link */}
      <div className="flex justify-end">
        <a href="#" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
          Hai bisogno di aiuto?
        </a>
      </div>

      {/* Two-Factor Authentication Section */}
      <div className="bg-white rounded-2xl shadow-apple border border-gray-100 p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Autenticazione a due fattori</h2>
        
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            L'autenticazione a due fattori (2FA) è un processo di sicurezza in cui un utente fornisce due diversi 
            fattori di autenticazione per verificare la propria identità e proteggere le credenziali.
          </p>
          <p>
            L'2FA offre un livello di sicurezza più elevato rispetto all'autenticazione a fattore singolo (SFA), che 
            generalmente utilizza solo un fattore, ad esempio una password o un PIN. Con l'2FA, l'utente fornisce 
            generalmente una password e un fattore aggiuntivo, spesso un codice di accesso inviato via e-mail, SMS 
            o messaggio in-app.
          </p>
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="bg-white rounded-2xl shadow-apple border border-gray-100 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Come settare il Autenticazione a due fattori
        </h3>
        
        <ol className="space-y-3 text-gray-700 ml-5">
          <li className="list-decimal">
            Scegli il metodo di autenticazione (Google Authenticator o Email)
          </li>
          <li className="list-decimal">
            Clicca sul pulsante "Attiva l'autenticazione a due fattori"
          </li>
          <li className="list-decimal">
            Se scegli Google Authenticator, scansiona il codice QR fornito nella tua app Authenticator. 
            Se scegli Email, riceverai un codice via email.
          </li>
          <li className="list-decimal">
            Conferma il codice a 6 cifre fornito dalla tua app Authenticator o via email
          </li>
          <li className="list-decimal">
            Clicca sul pulsante "Invia" per finalizzare la configurazione dell'autenticazione a due fattori
          </li>
        </ol>
      </div>

      {/* Authentication Methods */}
      <div className="bg-white rounded-2xl shadow-apple border border-gray-100 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Metodi di Autenticazione Disponibili
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Google Authenticator */}
          <div className="border-2 border-gray-200 rounded-xl p-6">
            <h4 className="text-xl font-bold text-gray-900 mb-3">Google Authenticator</h4>
            <p className="text-gray-600 mb-4">
              Genera codici di sicurezza temporanei sul tuo smartphone
            </p>
            <div className="flex gap-2">
              <a 
                href="https://apps.apple.com/app/google-authenticator/id388497605" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-black text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
              >
                <span className="text-xl">🍎</span>
                <span className="text-xs font-medium">App Store</span>
              </a>
              <a 
                href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-black text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
              >
                <span className="text-xl">▶</span>
                <span className="text-xs font-medium">Google Play</span>
              </a>
            </div>
          </div>

          {/* Email Authentication */}
          <div className="border-2 border-gray-200 rounded-xl p-6">
            <h4 className="text-xl font-bold text-gray-900 mb-3">Via Email</h4>
            <p className="text-gray-600 mb-4">
              Ricevi codici di sicurezza via email al momento dell'accesso
            </p>
            <p className="text-sm text-gray-500 italic">
              Nessuna app da installare. Usa semplicemente la tua email.
            </p>
          </div>
        </div>
      </div>

      {/* Status and Activation */}
      <div className="bg-white rounded-2xl shadow-apple border border-gray-100 p-8">
        {!is2FAEnabled && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <p className="text-red-700 font-medium">
                L'autenticazione a due fattori è disabilitata
              </p>
            </div>
          </div>
        )}
        
        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-xl font-bold text-lg transition-colors">
          ATTIVARE AUTENTICAZIONE A DUE FATTORI
        </button>
      </div>
    </div>
  )
}
