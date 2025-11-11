/**
 * RegisterPage
 * Pagina di registrazione con wizard a 5 step
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegisterStore, validateStep } from '@/store/registerStore'
import { useAuthStore } from '@/store/authStore'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'

// Import step components
import ProgressBar from '@/components/register/ProgressBar'
import StepCountry from '@/components/register/StepCountry'
import StepAccount from '@/components/register/StepAccount'
import StepIdentity from '@/components/register/StepIdentity'
import StepContacts from '@/components/register/StepContacts'
import StepCredentials from '@/components/register/StepCredentials'
import ErrorMessage from '@/components/register/ErrorMessage'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, clearError } = useAuthStore()
  const {
    step,
    country,
    phone_prefix,
    account_type,
    nome,
    cognome,
    ragione_sociale,
    piva,
    phone,
    email,
    username,
    password,
    password_confirmation,
    // termsAccepted,
    // privacyAccepted,
    // cancellationAccepted,
    // adultConfirmed,
    next,
    prev,
    reset,
    // setLoading,
    clearAllErrors,
    setError,
    errors
  } = useRegisterStore()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Check if current step is valid
  const isCurrentStepValid = validateStep(step, useRegisterStore.getState())

  // Handle step navigation
  const handleNext = () => {
    if (isCurrentStepValid && step < 5) {
      next()
    }
  }

  const handlePrev = () => {
    if (step > 1) {
      prev()
    }
  }

  // Handle final submission
  const handleSubmit = async () => {
    if (!isCurrentStepValid) return

    setIsSubmitting(true)
    clearAllErrors()
    clearError()

    try {
      // Assicurati che i dati siano salvati nello store prima di procedere
      // Questo è importante per nome e cognome che potrebbero non essere stati salvati
      const storeState = useRegisterStore.getState()
      
      // Prepare registration data
      const registerData = {
        account_type: account_type!,
        country,
        phone_prefix,
        telefono: phone!,
        email: email!,
        username: username!,
        password: password!,
        password_confirmation: password_confirmation!,
        // Add personal or business fields based on account type
        ...(account_type === 'personal' 
          ? { 
              nome: storeState.nome || nome || '', 
              cognome: storeState.cognome || cognome || '' 
            }
          : { 
              ragione_sociale: storeState.ragione_sociale || ragione_sociale || '', 
              piva: storeState.piva || piva || '' 
            }
        )
      }

      // Log per debug
      console.log('📝 Dati registrazione preparati:', {
        ...registerData,
        password: '***',
        password_confirmation: '***'
      })
      console.log('📝 Valori nome e cognome dallo store:', { 
        nome: storeState.nome, 
        cognome: storeState.cognome 
      })
      console.log('📝 Valori nome e cognome dai props:', { nome, cognome })
      console.log('📝 Account type:', account_type)

      // Call registration using authStore
      await register(registerData)

      // Show success modal
      setShowSuccessModal(true)
      
      // Reset form after delay
      setTimeout(() => {
        reset()
        navigate('/success?type=register')
      }, 3000)
    } catch (error: any) {
      console.error('Registration error:', error)
      
      // Handle different error types
      if (error.response?.status === 422) {
        // Validation errors - map to form fields
        const errors = error.response.data.errors || {}
        Object.keys(errors).forEach(field => {
          setError(field, errors[field][0])
        })
      } else if (error.response?.status === 429) {
        // Rate limit
        setError('general', 'Troppi tentativi, riprova più tardi')
      } else {
        // Generic error
        setError('general', error.message || 'Errore durante la registrazione')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render current step
  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return <StepCountry />
      case 2:
        return <StepAccount />
      case 3:
        return <StepIdentity />
      case 4:
        return <StepContacts />
      case 5:
        return <StepCredentials />
      default:
        return <StepCountry />
    }
  }

  // Get step titles for navigation
  const getStepTitle = (stepNumber: number) => {
    const titles = {
      1: 'Paese',
      2: 'Account',
      3: 'Dati',
      4: 'Contatti',
      5: 'Credenziali'
    }
    return titles[stepNumber as keyof typeof titles] || ''
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 text-gray-900 hover:text-orange-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Torna alla home</span>
            </Link>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">Registrazione</h1>
              <p className="text-sm text-gray-600">Step {step} di 5 - {getStepTitle(step)}</p>
            </div>
            
            <Link to="/login" className="text-gray-600 hover:text-orange-600 transition-colors">
              <X className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Step Content */}
          <div className="p-8">
            {/* General Error Message */}
            {errors.general && errors.general.length > 0 && (
              <div className="mb-6">
                <ErrorMessage 
                  message={errors.general[0]} 
                  onClose={() => clearAllErrors()}
                />
              </div>
            )}
            
            {renderCurrentStep()}
          </div>

          {/* Navigation */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              {/* Back Button */}
              <button
                type="button"
                onClick={handlePrev}
                disabled={step === 1}
                className={`
                  px-6 py-3 rounded-xl font-medium transition-all duration-200
                  ${step === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
              >
                <ArrowLeft className="w-4 h-4 inline mr-2" />
                Indietro
              </button>

              {/* Step Indicator */}
              <div className="text-sm text-gray-500">
                {step} di 5
              </div>

              {/* Next/Submit Button */}
              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isCurrentStepValid}
                  className={`
                    px-8 py-3 rounded-xl font-medium transition-all duration-200
                    ${isCurrentStepValid
                      ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  Prosegui
                  <ArrowRight className="w-4 h-4 inline ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isCurrentStepValid || isSubmitting}
                  className={`
                    px-8 py-3 rounded-xl font-medium transition-all duration-200
                    ${isCurrentStepValid && !isSubmitting
                      ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline mr-2"></div>
                      Registrazione...
                    </>
                  ) : (
                    'Completa Registrazione'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Registrazione completata!
            </h3>
            <p className="text-gray-600 mb-6">
              Ti abbiamo inviato un'email di verifica. Controlla la tua casella di posta e clicca sul link per attivare il tuo account.
            </p>
            <div className="text-sm text-gray-500">
              Reindirizzamento in corso...
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

