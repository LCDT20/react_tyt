/**
 * ErrorMessage
 * Componente per visualizzare errori generali
 */

import { AlertCircle, X } from 'lucide-react'

interface ErrorMessageProps {
  message: string
  onClose?: () => void
  type?: 'error' | 'warning' | 'info'
}

export default function ErrorMessage({ 
  message, 
  onClose, 
  type = 'error' 
}: ErrorMessageProps) {
  const getStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-red-50 border-red-200 text-red-800'
    }
  }

  const getIconColor = () => {
    switch (type) {
      case 'error':
        return 'text-red-500'
      case 'warning':
        return 'text-yellow-500'
      case 'info':
        return 'text-blue-500'
      default:
        return 'text-red-500'
    }
  }

  return (
    <div className={`
      rounded-xl border p-4 flex items-start space-x-3
      ${getStyles()}
    `} role="alert">
      <AlertCircle className={`w-5 h-5 mt-0.5 ${getIconColor()}`} />
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
