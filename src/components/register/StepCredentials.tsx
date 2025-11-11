/**
 * StepCredentials
 * Step 5: Username, password e termini
 */

import { useState, useEffect } from 'react'
import { useRegisterStore, PASSWORD_REGEX } from '@/store/registerStore'
import { useAsyncValidation, validators } from '@/hooks/useAsyncValidation'
import { User, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'

export default function StepCredentials() {
  const { 
    username,
    password,
    password_confirmation,
    termsAccepted,
    privacyAccepted,
    cancellationAccepted,
    adultConfirmed,
    setCredentials,
    setTerms,
    errors,
    clearError
  } = useRegisterStore()

  const [formData, setFormData] = useState({
    username: username || '',
    password: password || '',
    password_confirmation: password_confirmation || '',
    termsAccepted: termsAccepted,
    privacyAccepted: privacyAccepted,
    cancellationAccepted: cancellationAccepted,
    adultConfirmed: adultConfirmed,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  
  // Use async validation hook for username
  const usernameValidation = useAsyncValidation(formData.username, {
    validator: validators.username.async,
    immediateValidation: validators.username.immediate,
    debounceMs: 400
  })

  // Update form state when store changes
  useEffect(() => {
    setFormData({
      username: username || '',
      password: password || '',
      password_confirmation: password_confirmation || '',
      termsAccepted,
      privacyAccepted,
      cancellationAccepted,
      adultConfirmed,
    })
  }, [username, password, password_confirmation, termsAccepted, privacyAccepted, cancellationAccepted, adultConfirmed])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    clearError(field)
  }

  const handleCredentialsBlur = () => {
    setCredentials(formData.username, formData.password, formData.password_confirmation)
  }

  const handleTermsChange = (field: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }))
    setTerms(
      field === 'termsAccepted' ? checked : formData.termsAccepted,
      field === 'privacyAccepted' ? checked : formData.privacyAccepted,
      field === 'cancellationAccepted' ? checked : formData.cancellationAccepted,
      field === 'adultConfirmed' ? checked : formData.adultConfirmed
    )
  }


  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: '' }
    
    let score = 0
    if (password.length >= 8) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z\d]/.test(password)) score++
    
    const strength = [
      { score: 0, label: 'Molto debole', color: 'bg-red-500' },
      { score: 1, label: 'Debole', color: 'bg-red-400' },
      { score: 2, label: 'Discreta', color: 'bg-yellow-400' },
      { score: 3, label: 'Buona', color: 'bg-yellow-500' },
      { score: 4, label: 'Forte', color: 'bg-green-400' },
      { score: 5, label: 'Molto forte', color: 'bg-green-500' },
    ]
    
    return strength[Math.min(score, 5)]
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const isPasswordValid = PASSWORD_REGEX.test(formData.password)
  const isPasswordMatch = formData.password === formData.password_confirmation && formData.password_confirmation.length > 0

  const hasError = (field: string) => errors[field] && errors[field].length > 0

  return (
    <div className="max-w-md mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Credenziali e termini
          </h3>
          <p className="text-gray-600">
            Scegli username, password e accetta i termini
          </p>
        </div>

        {/* Credentials Form */}
        <div className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                onBlur={handleCredentialsBlur}
                className={`
                  w-full pl-10 pr-10 py-3 border rounded-xl shadow-sm transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                  ${hasError('username')
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : usernameValidation.isValid
                      ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                      : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                placeholder="mario_rossi"
                autoComplete="username"
              />
              
              {/* Username validation icon */}
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {usernameValidation.isChecking ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>
                ) : usernameValidation.isValid ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : formData.username && !usernameValidation.isValid && !usernameValidation.isChecking ? (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                ) : null}
              </div>
            </div>
            
            {/* Username validation message */}
            {formData.username && usernameValidation.message && (
              <div className={`
                text-sm mt-1 flex items-center space-x-1
                ${usernameValidation.isValid 
                  ? 'text-green-600' 
                  : usernameValidation.isChecking
                    ? 'text-orange-600'
                    : 'text-red-600'
                }
              `} role="alert">
                {usernameValidation.isChecking ? (
                  <div className="animate-spin rounded-full h-3 w-3 border border-orange-500 border-t-transparent"></div>
                ) : usernameValidation.isValid ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
                <span>{usernameValidation.message}</span>
              </div>
            )}
            
            {hasError('username') && (
              <div className="text-red-600 text-sm mt-1" role="alert">
                {errors.username[0]}
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onBlur={handleCredentialsBlur}
                className={`
                  w-full pl-10 pr-10 py-3 border rounded-xl shadow-sm transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                  ${hasError('password')
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : isPasswordValid
                      ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                      : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                placeholder="Password123"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Password strength indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">{passwordStrength.label}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Minimo 8 caratteri, 1 maiuscola, 1 minuscola, 1 numero
                </div>
              </div>
            )}
            
            {hasError('password') && (
              <div className="text-red-600 text-sm mt-1" role="alert">
                {errors.password[0]}
              </div>
            )}
          </div>

          {/* Password Confirmation */}
          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
              Conferma Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type={showPasswordConfirmation ? 'text' : 'password'}
                id="password_confirmation"
                value={formData.password_confirmation}
                onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                onBlur={handleCredentialsBlur}
                className={`
                  w-full pl-10 pr-10 py-3 border rounded-xl shadow-sm transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                  ${hasError('password_confirmation')
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : isPasswordMatch
                      ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                      : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                placeholder="Password123"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPasswordConfirmation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Password match indicator */}
            {formData.password_confirmation && (
              <div className="text-sm mt-1 flex items-center space-x-1">
                {isPasswordMatch ? (
                  <>
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-green-600">Le password coincidono</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 text-red-500" />
                    <span className="text-red-600">Le password non coincidono</span>
                  </>
                )}
              </div>
            )}
            
            {hasError('password_confirmation') && (
              <div className="text-red-600 text-sm mt-1" role="alert">
                {errors.password_confirmation[0]}
              </div>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Termini e condizioni *</h4>
          
          <div className="space-y-3">
            {/* Terms of Service */}
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) => handleTermsChange('termsAccepted', e.target.checked)}
                className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">
                Accetto i{' '}
                <a href="/legal/terms" target="_blank" className="text-orange-600 hover:text-orange-700 underline">
                  Termini di Servizio
                </a>
              </span>
            </label>

            {/* Privacy Policy */}
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.privacyAccepted}
                onChange={(e) => handleTermsChange('privacyAccepted', e.target.checked)}
                className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">
                Accetto la{' '}
                <a href="/legal/privacy" target="_blank" className="text-orange-600 hover:text-orange-700 underline">
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* Cancellation Policy */}
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.cancellationAccepted}
                onChange={(e) => handleTermsChange('cancellationAccepted', e.target.checked)}
                className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">
                Accetto la{' '}
                <a href="/legal/cancellation" target="_blank" className="text-orange-600 hover:text-orange-700 underline">
                  Politica di Cancellazione
                </a>
              </span>
            </label>

            {/* Age Confirmation */}
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.adultConfirmed}
                onChange={(e) => handleTermsChange('adultConfirmed', e.target.checked)}
                className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">
                Confermo di essere maggiorenne (18+ anni)
              </span>
            </label>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Sicurezza account</p>
              <p>La tua password deve essere sicura e unica. Non condividerla mai con altri.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
