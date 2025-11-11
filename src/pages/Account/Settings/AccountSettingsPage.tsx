/**
 * AccountSettingsPage Component
 * Settings page with various configuration options
 */

import { Languages, Mail, Home, UserX, Globe, Filter, ArrowUpDown } from 'lucide-react'
import { ChevronRight } from 'lucide-react'

export default function AccountSettingsPage() {
  const settings = [
    {
      icon: Languages,
      title: 'Impostazioni lingua',
      description: 'Imposta la lingua della pagina e dei nomi delle carte.',
    },
    {
      icon: Mail,
      title: 'Le mie opzioni email',
      description: 'Filtra le mail automatiche che vuoi ricevere.',
    },
    {
      icon: Home,
      title: 'Home Page',
      description: 'Gestisci come mostrare la Home Page quando ti connetti',
    },
    {
      icon: UserX,
      title: 'Lista utenti bloccati',
      description: 'Scegli con chi non vuoi interagire.',
    },
    {
      icon: Globe,
      title: 'Nazioni alle quali spedisci',
      description: 'Seleziona i paesi dove spedisci ed escludi quelli dove non vuoi spedire.',
    },
    {
      icon: Filter,
      title: 'Filtri personalizzati',
      description: 'Imposta i filtri da applicare alle pagine dei prodotti e agli inventari degli utenti.',
    },
    {
      icon: ArrowUpDown,
      title: 'Ordina articoli',
      description: 'Imposta in quale ordine vuoi visualizzare gli articoli nelle spedizioni.',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Help Link */}
      <div className="flex justify-end">
        <a href="#" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
          Hai bisogno di aiuto?
        </a>
      </div>

      {/* Settings List */}
      <div className="bg-white rounded-2xl shadow-apple border border-gray-100">
        <div className="divide-y divide-gray-200">
          {settings.map((setting, index) => (
            <button
              key={index}
              className="w-full flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors text-left group"
            >
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-orange-50 rounded-lg">
                <setting.icon className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{setting.title}</h3>
                <p className="text-sm text-gray-600">{setting.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
