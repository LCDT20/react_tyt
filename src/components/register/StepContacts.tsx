/**
 * StepContacts
 * Step 4: Telefono e email
 */

import { useState, useEffect } from 'react'
import { useRegisterStore } from '@/store/registerStore'
import { useAsyncValidation, validators } from '@/hooks/useAsyncValidation'
import { Phone, Mail, CheckCircle, AlertCircle } from 'lucide-react'

export default function StepContacts() {
  const { 
    phone_prefix,
    phone,
    email,
    setContacts,
    errors,
    clearError
  } = useRegisterStore()

  const [phoneValue, setPhoneValue] = useState(phone || '')
  const [emailValue, setEmailValue] = useState(email || '')
  
  // Use async validation hook for email
  const emailValidation = useAsyncValidation(emailValue, {
    validator: validators.email.async,
    immediateValidation: validators.email.immediate,
    debounceMs: 400
  })

  // Update form state when store changes
  useEffect(() => {
    setPhoneValue(phone || '')
    setEmailValue(email || '')
  }, [phone, email])

  const handlePhoneChange = (value: string) => {
    // Remove non-numeric characters except + and spaces
    const cleaned = value.replace(/[^\d\s\+\-\(\)]/g, '')
    setPhoneValue(cleaned)
    clearError('phone')
  }

  const handleEmailChange = (value: string) => {
    setEmailValue(value)
    clearError('email')
  }

  const handlePhoneBlur = () => {
    if (phoneValue.trim()) {
      setContacts(phoneValue.trim(), emailValue.trim())
    }
  }

  const handleEmailBlur = () => {
    if (emailValue.trim()) {
      setContacts(phoneValue.trim(), emailValue.trim())
    }
  }


  const hasPhoneError = errors.phone && errors.phone.length > 0
  const hasEmailError = errors.email && errors.email.length > 0

  return (
    <div className="max-w-md mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            I tuoi contatti
          </h3>
          <p className="text-gray-600">
            Inserisci telefono e email per completare la registrazione
          </p>
        </div>

        {/* Contact Form */}
        <div className="space-y-4">
          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Numero di telefono *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="ml-2 text-gray-500 text-sm font-mono">{phone_prefix}</span>
              </div>
              <input
                type="tel"
                id="phone"
                value={phoneValue}
                onChange={(e) => handlePhoneChange(e.target.value)}
                onBlur={handlePhoneBlur}
                className={`
                  w-full pl-20 pr-4 py-3 border rounded-xl shadow-sm transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                  ${hasPhoneError
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                placeholder="333 123 4567"
                autoComplete="tel"
              />
            </div>
            {hasPhoneError && (
              <div className="text-red-600 text-sm mt-1" role="alert">
                {errors.phone[0]}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Prefisso: {phone_prefix} (non modificabile)
            </p>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Indirizzo email *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={emailValue}
                onChange={(e) => handleEmailChange(e.target.value)}
                onBlur={handleEmailBlur}
                className={`
                  w-full pl-10 pr-10 py-3 border rounded-xl shadow-sm transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                  ${hasEmailError
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : emailValidation.isValid
                      ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                      : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                placeholder="mario.rossi@example.com"
                autoComplete="email"
              />
              
              {/* Email validation icon */}
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {emailValidation.isChecking ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>
                ) : emailValidation.isValid ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : emailValue && !emailValidation.isValid && !emailValidation.isChecking ? (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                ) : null}
              </div>
            </div>
            
            {/* Email validation message */}
            {emailValue && emailValidation.message && (
              <div className={`
                text-sm mt-1 flex items-center space-x-1
                ${emailValidation.isValid 
                  ? 'text-green-600' 
                  : emailValidation.isChecking
                    ? 'text-orange-600'
                    : 'text-red-600'
                }
              `} role="alert">
                {emailValidation.isChecking ? (
                  <div className="animate-spin rounded-full h-3 w-3 border border-orange-500 border-t-transparent"></div>
                ) : emailValidation.isValid ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
                <span>{emailValidation.message}</span>
              </div>
            )}
            
            {hasEmailError && (
              <div className="text-red-600 text-sm mt-1" role="alert">
                {errors.email[0]}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Verifica contatti</p>
              <p>Ti invieremo un codice di verifica via SMS e email per confermare i tuoi contatti.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
