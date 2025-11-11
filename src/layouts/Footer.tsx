/**
 * Footer Component
 * Footer Apple-style minimalista
 */

import { Link } from 'react-router-dom'
import { config } from '@/lib/config'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                  Chi siamo
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                  Come funziona
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                  Contatti
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Legale</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/legal/terms" className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                  Termini e condizioni
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy" className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/cookies" className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Supporto</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                  Centro assistenza
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Social</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            © {currentYear} {config.app.name}. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  )
}

