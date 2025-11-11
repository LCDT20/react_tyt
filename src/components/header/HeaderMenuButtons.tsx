/**
 * HeaderMenuButtons Component
 * Pulsanti a destra dell'header (Home, Logout, Hamburger)
 */

import { Link } from 'react-router-dom'
import { Home, LogOut, Menu as MenuIcon } from 'lucide-react'

interface HeaderMenuButtonsProps {
  isAuthenticated: boolean
  onLogout: () => void
  onToggleSidebar: () => void
}

export default function HeaderMenuButtons({ 
  isAuthenticated, 
  onLogout, 
  onToggleSidebar 
}: HeaderMenuButtonsProps) {
  return (
    <div className="absolute top-1/2 right-8 lg:right-8 -translate-y-1/2 flex items-center gap-2">
      {isAuthenticated && (
        <>
          {/* Home Button */}
          <Link
            to="/dashboard"
            className="w-9 h-9 flex items-center justify-center
                     bg-[rgba(255,101,5,0.3)] border-2 border-orange-500 rounded-md
                     text-orange-500
                     hover:bg-[rgba(255,101,5,0.45)] hover:shadow-[0_0_12px_rgba(255,165,0,0.4)]
                     transition-all duration-200"
            title="Dashboard"
          >
            <Home className="w-4 h-4" />
          </Link>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-9 h-9 flex items-center justify-center
                     bg-[rgba(255,101,5,0.3)] border-2 border-orange-500 rounded-md
                     text-orange-500
                     hover:bg-[rgba(255,101,5,0.45)] hover:shadow-[0_0_12px_rgba(255,165,0,0.4)]
                     transition-all duration-200"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Hamburger Menu Button */}
      <button
        onClick={onToggleSidebar}
        className="w-9 h-9 flex items-center justify-center
                 bg-[rgba(255,101,5,0.3)] border-2 border-orange-500 rounded-md
                 text-orange-500
                 hover:bg-[rgba(255,101,5,0.45)] hover:shadow-[0_0_12px_rgba(255,165,0,0.4)]
                 transition-all duration-200"
        title="Menu"
      >
        <MenuIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

