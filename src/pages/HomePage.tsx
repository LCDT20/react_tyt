/**
 * HomePage
 * Pagina principale / landing page
 */

import { Link } from 'react-router-dom'
import { Search, TrendingUp, Users, ShieldCheck } from 'lucide-react'
import SearchDebug from '@/components/debug/SearchDebug'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-32 px-4 relative min-h-[80vh] flex items-center">
        {/* Overlay per migliorare la leggibilità del testo */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 drop-shadow-lg">
            <span className="text-orange-400">Take Your Trade</span>
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 mb-16 max-w-4xl mx-auto drop-shadow-md">
            La piattaforma completa per comprare, vendere e scambiare carte
            Magic The Gathering con la community europea
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/register" className="btn-primary text-xl px-12 py-6 text-lg font-semibold">
              Inizia Ora
            </Link>
            <Link to="/cards/search" className="btn-outline text-xl px-12 py-6 text-lg font-semibold">
              Esplora Carte
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Perché scegliere Take Your Trade?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-4">
                <Search className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ricerca Avanzata</h3>
              <p className="text-gray-600">
                Trova rapidamente le carte che cerchi con filtri potenti
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-4">
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Prezzi di Mercato</h3>
              <p className="text-gray-600">
                Integrazione con CardTrader per prezzi sempre aggiornati
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-4">
                <Users className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sistema Scambi</h3>
              <p className="text-gray-600">
                Scambia carte con altri utenti in modo sicuro
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-4">
                <ShieldCheck className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sicurezza</h3>
              <p className="text-gray-600">
                Transazioni sicure e protezione dei dati personali
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Pronto per iniziare?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Unisciti a migliaia di giocatori che già usano Take Your Trade
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-orange-500 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
          >
            Registrati Gratuitamente
          </Link>
        </div>
      </section>
      
      {/* Debug Component - Solo in sviluppo */}
      {/* {import.meta.env.DEV && <SearchDebug />} */}
    </div>
  )
}

