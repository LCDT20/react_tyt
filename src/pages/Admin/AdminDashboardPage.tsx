/**
 * AdminDashboardPage
 * Dashboard amministratore
 */

import { Shield } from 'lucide-react'

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Admin Dashboard
        </h1>

        <div className="card p-12 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 text-lg">
            Pannello amministrazione in fase di sviluppo
          </p>
        </div>
      </div>
    </div>
  )
}

