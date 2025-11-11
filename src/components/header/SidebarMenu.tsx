/**
 * SidebarMenu Component
 * Menu laterale slide da destra
 */

import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LogIn,
  UserPlus,
  Search,
  Users,
  MessageCircle,
  Folder,
  Moon,
  HelpCircle,
  FileText,
  Shield,
  LogOut,
  X,
} from 'lucide-react'

interface SidebarMenuProps {
  isOpen: boolean
  isAuthenticated: boolean
  onClose: () => void
  onLogout: () => void
  onOpenLoginSidebar?: () => void
}

export default function SidebarMenu({ 
  isOpen, 
  isAuthenticated, 
  onClose, 
  onLogout,
  onOpenLoginSidebar 
}: SidebarMenuProps) {
  
  const sidebarVariants = {
    hidden: { x: '100%' },
    visible: { 
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }
    },
    exit: { 
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }
    }
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1100]"
          />

          {/* Sidebar */}
          <motion.div
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 bottom-0 w-[280px] md:w-[300px] bg-white shadow-2xl z-[1200] overflow-y-auto"
          >
            {/* Header Sidebar */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="py-3">
              {/* Guest User Menu */}
              {!isAuthenticated && (
                <>
                  <button
                    onClick={() => {
                      onClose()
                      onOpenLoginSidebar?.()
                    }}
                    className="w-full flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-orange-100/50"
                  >
                    <LogIn className="w-5 h-5 text-orange-500" />
                    <span className="font-medium">Login</span>
                  </button>
                  
                  <Link
                    to="/register"
                    onClick={onClose}
                    className="w-full flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-orange-100/50"
                  >
                    <UserPlus className="w-5 h-5 text-orange-500" />
                    <span className="font-medium">Registrati</span>
                  </Link>
                </>
              )}

              {/* Common Menu Items */}
              <Link
                to="/cards/search"
                onClick={onClose}
                className="w-full flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-orange-100/50"
              >
                <Search className="w-5 h-5 text-orange-500" />
                <span className="font-medium">Cerca carte</span>
              </Link>

              <Link
                to="/users/search"
                onClick={onClose}
                className="w-full flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-orange-100/50"
              >
                <Users className="w-5 h-5 text-orange-500" />
                <span className="font-medium">Cerca utenti</span>
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to="/messages"
                    onClick={onClose}
                    className="w-full flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-orange-100/50"
                  >
                    <MessageCircle className="w-5 h-5 text-orange-500" />
                    <span className="font-medium">Messaggi</span>
                  </Link>

                  <Link
                    to="/collection"
                    onClick={onClose}
                    className="w-full flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-orange-100/50"
                  >
                    <Folder className="w-5 h-5 text-orange-500" />
                    <span className="font-medium">Collezione</span>
                  </Link>
                </>
              )}

              {/* Dark Mode Toggle (placeholder) */}
              <button
                className="w-full flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-orange-100/50"
              >
                <Moon className="w-5 h-5 text-orange-500" />
                <span className="font-medium">Dark Mode</span>
              </button>

              {/* Help & Legal */}
              <Link
                to="/help"
                onClick={onClose}
                className="w-full flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-orange-100/50"
              >
                <HelpCircle className="w-5 h-5 text-orange-500" />
                <span className="font-medium">Aiuto</span>
              </Link>

              <Link
                to="/legal/terms"
                onClick={onClose}
                className="w-full flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-orange-100/50"
              >
                <FileText className="w-5 h-5 text-orange-500" />
                <span className="font-medium">Norme</span>
              </Link>

              <Link
                to="/legal/privacy"
                onClick={onClose}
                className="w-full flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-orange-100/50"
              >
                <Shield className="w-5 h-5 text-orange-500" />
                <span className="font-medium">Condizioni</span>
              </Link>

              {/* Logout */}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    onLogout()
                    onClose()
                  }}
                  className="w-full flex items-center gap-3 px-5 py-4 text-red-600 hover:bg-red-50 transition-colors border-b border-orange-100/50"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

