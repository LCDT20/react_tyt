/**
 * AccountPage
 * Pagina principale per gestione account utente con sistema di tabs
 */

import { useState } from 'react'
import { User, ShoppingBag, Package, MessageSquare, ShoppingCart, FileText } from 'lucide-react'
import TabNavigation from '@/components/ui/TabNavigation'
import UserProfileTab from './tabs/UserProfileTab'
import PurchaseHistoryTab from './tabs/PurchaseHistoryTab'
import SalesHistoryTab from './tabs/SalesHistoryTab'
import MessagesTab from './tabs/MessagesTab'
import ShoppingCartTab from './tabs/ShoppingCartTab'
import ListedArticlesTab from './tabs/ListedArticlesTab'

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Il Mio Profilo', icon: <User className="w-5 h-5" /> },
    { id: 'purchases', label: 'I Miei Acquisti', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'sales', label: 'Le Mie Vendite', icon: <Package className="w-5 h-5" /> },
    { id: 'messages', label: 'I Miei Messaggi', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'cart', label: 'Il Mio Carrello', icon: <ShoppingCart className="w-5 h-5" /> },
    { id: 'articles', label: 'I Miei Articoli', icon: <FileText className="w-5 h-5" /> },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <UserProfileTab />
      case 'purchases':
        return <PurchaseHistoryTab />
      case 'sales':
        return <SalesHistoryTab />
      case 'messages':
        return <MessagesTab />
      case 'cart':
        return <ShoppingCartTab />
      case 'articles':
        return <ListedArticlesTab />
      default:
        return <UserProfileTab />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Il Mio Account
          </h1>
          <p className="text-gray-600">
            Gestisci il tuo profilo, ordini e articoli in vendita
          </p>
        </div>

        {/* Tab Navigation */}
        <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="mt-6">{renderTabContent()}</div>
      </div>
    </div>
  )
}




