/**
 * AccountSidebar Component
 * Navigation sidebar for account section
 */

import { NavLink } from 'react-router-dom'

export default function AccountSidebar() {
  const navigationItems = [
    { path: 'profile', label: 'Profilo' },
    { path: 'addresses', label: 'Indirizzi' },
    { path: 'credit', label: 'Credito' },
    { path: 'transactions', label: 'Transazioni' },
    { path: 'security', label: 'Sicurezza' },
    { path: 'settings', label: 'Impostazioni' },
    { path: 'synchronization', label: 'Sincronizzazione' },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-apple border border-gray-100 p-6 sticky top-20">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">ACCOUNT</h2>
      <nav className="space-y-1">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
