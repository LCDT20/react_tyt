/**
 * LegalPage
 * Pagina termini legali
 */

import { FileText } from 'lucide-react'

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Informazioni Legali
        </h1>

        <div className="card p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 text-lg">
            Pagine legali in fase di sviluppo
          </p>
        </div>
      </div>
    </div>
  )
}

