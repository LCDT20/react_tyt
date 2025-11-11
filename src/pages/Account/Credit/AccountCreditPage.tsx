/**
 * AccountCreditPage Component
 * Credit management page with withdrawal options
 */

import { Clock, Link as LinkIcon, Banknote } from 'lucide-react'

export default function AccountCreditPage() {
  // Dati fittizi
  const creditBalance = 1250.00
  const bankAccount = {
    accountHolder: 'Julian Rovera',
    iban: 'IT94N0200830540000430071296',
    bic: 'UNCRITMMXXX',
    bankName: 'UNICREDIT SPA',
  }

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
            <a href="/account/transactions" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
              Tutte le transazioni
            </a>
          </div>
        </div>
      </div>

      {/* Withdrawal Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PayPal Option */}
        <div className="bg-white rounded-2xl shadow-apple border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">P</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">PayPal</div>
            </div>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">Istantaneo</span>
            </div>
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">Tasse di accredito istantaneo (5% + 0,35 €)</span>
            </div>
          </div>

          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-colors">
            PAGARE CON PAYPAL
          </button>
        </div>

        {/* Bank Transfer Option */}
        <div className="bg-white rounded-2xl shadow-apple border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Banknote className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">Bonifico Bancario</div>
            </div>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">Fino a 5 giorni lavorativi</span>
            </div>
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">Senza costi aggiuntivi (0,00 €)</span>
            </div>
          </div>

          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-colors">
            PAGARE CON TRASFERIMENTO BANCARIO
          </button>
        </div>
      </div>

      {/* Bank Account Details */}
      <div className="bg-white rounded-2xl shadow-apple border border-gray-100 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Conto bancario</h3>
        <p className="text-gray-600 mb-6">Dati bancari associati al tuo account</p>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 uppercase block mb-1">
              INTESTATARIO DEL CONTO
            </label>
            <p className="text-gray-900 font-medium">{bankAccount.accountHolder}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600 uppercase block mb-1">
              IBAN
            </label>
            <p className="text-gray-900 font-mono">{bankAccount.iban}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600 uppercase block mb-1">
              BIC/SWIFT
            </label>
            <p className="text-gray-900 font-mono">{bankAccount.bic}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600 uppercase block mb-1">
              NOME DELLA BANCA
            </label>
            <p className="text-gray-900 font-medium">{bankAccount.bankName}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
