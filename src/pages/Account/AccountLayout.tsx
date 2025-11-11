/**
 * AccountLayout Component
 * Two-column layout for account section (sidebar + content)
 */

import { Outlet } from 'react-router-dom'
import AccountSidebar from '@/components/account/AccountSidebar'

export default function AccountLayout() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Il Mio Account
          </h1>
          <p className="text-gray-600">
            Gestisci il tuo profilo e le impostazioni del tuo account
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Left Column */}
          <div className="lg:col-span-1">
            <AccountSidebar />
          </div>

          {/* Content - Right Column */}
          <div className="lg:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
