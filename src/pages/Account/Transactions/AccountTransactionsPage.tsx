/**
 * AccountTransactionsPage Component
 * Transactions history page
 */

import { Calendar } from 'lucide-react'
import { useState } from 'react'

export default function AccountTransactionsPage() {
  const [dateFrom, setDateFrom] = useState('01/10/2025')
  const [dateTo, setDateTo] = useState('27/10/2025')
  
  const creditBalance = 0.00

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Help Link */}
      <div className="flex justify-end">
        <a href="#" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
          Hai bisogno di aiuto?
        </a>
      </div>

      {/* Credit Overview Section */}
      <div className="bg-white rounded-2xl shadow-apple border border-gray-100 p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-gray-900">Credito</h2>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-semibold transition-colors">
              RICARICA IL TUO CONTO
            </button>
            <button className="border-2 border-orange-500 text-orange-500 px-6 py-2 rounded-xl font-semibold hover:bg-orange-50 transition-colors">
              RITIRA CREDITO
            </button>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-green-600 mb-2">{formatCurrency(creditBalance)}</p>
          </div>
        </div>
      </div>

      {/* Transactions Summary Section */}
      <div className="bg-white rounded-2xl shadow-apple border border-gray-100 p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Sommario transazioni</h2>
        
        {/* Filter Section */}
        <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Intervallo date</label>
            <select className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option>Mese corrente</option>
              <option>Ultimo mese</option>
              <option>Ultimi 3 mesi</option>
              <option>Ultimi 6 mesi</option>
              <option>Ultimo anno</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Dal</label>
            <div className="relative">
              <input
                type="text"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent w-32"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Al</label>
            <div className="relative">
              <input
                type="text"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent w-32"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
          
          <button className="ml-auto border-2 border-orange-500 text-orange-500 px-6 py-2 rounded-xl font-semibold hover:bg-orange-50 transition-colors">
            FILTRA
          </button>
        </div>

        {/* Empty State */}
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg">
            Non ci sono transazioni per il periodo selezionato.
          </p>
        </div>
      </div>
    </div>
  )
}
