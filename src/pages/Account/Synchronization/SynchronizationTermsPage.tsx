/**
 * SynchronizationTermsPage
 * Detailed terms and guidelines for CardTrader synchronization.
 */

import { Link } from 'react-router-dom'
import { ArrowLeft, RefreshCcw, ShieldCheck, CloudOff, Zap, AlertTriangle } from 'lucide-react'

export default function SynchronizationTermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-4">
          <Link
            to="/account/synchronization"
            className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna alla sincronizzazione
          </Link>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 text-orange-500 font-semibold uppercase text-xs tracking-wide">
              <RefreshCcw className="w-4 h-4" />
              CardTrader Sync
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">Termini e condizioni di sincronizzazione</h1>
            <p className="text-sm md:text-base text-gray-600 mt-3">
              Queste linee guida descrivono come TakeYourTrade gestisce l’integrazione con CardTrader, quali dati vengono sincronizzati,
              le responsabilità dell’utente e i limiti del servizio.
            </p>
          </div>
        </header>

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">1. Dati sincronizzati</h2>
          <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
            <p className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-orange-500 mt-0.5" />
              <span>
                Vengono importati automaticamente stock disponibili, prezzi e ristampe compatibili presenti nel tuo account CardTrader.
                Le informazioni sono aggiornate con frequenza periodica e non richiedono interventi manuali.
              </span>
            </p>
            <p className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-orange-500 mt-0.5" />
              <span>
                Alcune ristampe presenti esclusivamente su TakeYourTrade non saranno inviate verso CardTrader: rimangono gestite in modo indipendente
                per preservare il catalogo proprietario.
              </span>
            </p>
            <p className="flex items-start gap-3">
              <CloudOff className="w-5 h-5 text-orange-500 mt-0.5" />
              <span>
                Le immagini delle carte non vengono sincronizzate per evitare sovrascritture: resta all’utente gestire foto e contenuti multimediali
                direttamente all’interno di TakeYourTrade.
              </span>
            </p>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">2. Credenziali e sicurezza</h2>
          <ul className="space-y-3 text-sm text-gray-600 leading-relaxed list-disc pl-5">
            <li>
              Il token JWT generato su CardTrader viene utilizzato esclusivamente per le chiamate autorizzate di sincronizzazione.
              Viene conservato in modo sicuro sui nostri server e può essere revocato in qualsiasi momento dall’utente tramite l’interfaccia di TakeYourTrade.
            </li>
            <li>
              Revocare il token direttamente da CardTrader mentre la sincronizzazione è attiva interrompe il flusso di aggiornamento.
              In questo caso sarà necessario generare un nuovo token e ripetere la configurazione.
            </li>
            <li>
              Il webhook fornito da TakeYourTrade deve essere inserito nella dashboard CardTrader per ricevere notifiche in tempo reale.
              L’utente è responsabile del corretto inserimento e del mantenimento del collegamento.
            </li>
          </ul>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">3. Limitazioni del servizio</h2>
          <ul className="space-y-3 text-sm text-gray-600 leading-relaxed list-disc pl-5">
            <li>
              Alcune categorie di prodotto o varianti particolari potrebbero non essere supportate dalla sincronizzazione automatica.
              In questi casi i dati resteranno gestiti manualmente all’interno di TakeYourTrade.
            </li>
            <li>
              Gli aggiornamenti sono pianificati a intervalli regolari; eventuali modifiche su CardTrader potrebbero richiedere alcuni minuti
              prima di essere recepite nella piattaforma TakeYourTrade.
            </li>
            <li>
              TakeYourTrade non è responsabile di eventuali variazioni del servizio CardTrader (es. modifiche API, manutenzioni o interruzioni)
              che possano influenzare la sincronizzazione.
            </li>
          </ul>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">4. Responsabilità dell’utente</h2>
          <ul className="space-y-3 text-sm text-gray-600 leading-relaxed list-disc pl-5">
            <li>
              L’utente deve verificare che i dati importati corrispondano alla propria collezione e segnalare eventuali discrepanze al supporto TakeYourTrade.
            </li>
            <li>
              In caso di account condivisi o multi-utente, spetta al titolare assicurarsi che il token JWT non venga divulgato a terze parti non autorizzate.
            </li>
            <li>
              È consigliato effettuare un controllo periodico dello stato del webhook e del token per garantire il corretto funzionamento della sincronizzazione.
            </li>
          </ul>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">5. Disattivazione e assistenza</h2>
          <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
            <p className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
              <span>
                Per interrompere la sincronizzazione utilizza l’apposita funzione in TakeYourTrade: provvederemo a disabilitare token e webhook,
                evitando chiamate residue non autorizzate.
              </span>
            </p>
            <p>
              L’assistenza TakeYourTrade è disponibile per chiarimenti o supporto sulla configurazione all’indirizzo{' '}
              <a href="mailto:support@takeyourtrade.com" className="text-orange-600 hover:text-orange-700 font-semibold">
                support@takeyourtrade.com
              </a>.
            </p>
            <p>
              L’utilizzo continuativo della sincronizzazione implica l’accettazione di questi termini. Eventuali aggiornamenti saranno comunicati tramite email
              o direttamente nella dashboard utente.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}


