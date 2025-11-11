/**
 * ProgressBar
 * Barra di progresso per il wizard di registrazione
 */

import { useRegisterStore } from '@/store/registerStore'

const STEPS = [
  { number: 1, title: 'Paese', description: 'Seleziona il tuo paese' },
  { number: 2, title: 'Account', description: 'Tipo di account' },
  { number: 3, title: 'Dati', description: 'Informazioni personali' },
  { number: 4, title: 'Contatti', description: 'Telefono e email' },
  { number: 5, title: 'Credenziali', description: 'Username e password' },
]

export default function ProgressBar() {
  const { step } = useRegisterStore()
  
  const progressPercentage = ((step - 1) / (STEPS.length - 1)) * 100

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="relative" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={5} aria-label={`Step ${step} of 5`}>
        {/* Background Line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 rounded-full"></div>
        
        {/* Progress Line */}
        <div 
          className="absolute top-6 left-0 h-0.5 bg-orange-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
          aria-hidden="true"
        ></div>
        
        {/* Steps */}
        <div className="relative flex justify-between">
          {STEPS.map((stepData) => {
            const isActive = stepData.number === step
            const isCompleted = stepData.number < step
            // const isUpcoming = stepData.number > step
            
            return (
              <div key={stepData.number} className="flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                    ${isActive 
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                      : isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}
                  aria-current={isActive ? 'step' : undefined}
                  aria-valuenow={isActive ? stepData.number : undefined}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    stepData.number
                  )}
                </div>
                
                {/* Step Info */}
                <div className="mt-3 text-center">
                  <div className={`
                    text-sm font-medium transition-colors duration-200
                    ${isActive 
                      ? 'text-orange-600' 
                      : isCompleted 
                        ? 'text-green-600' 
                        : 'text-gray-500'
                    }
                  `}>
                    {stepData.title}
                  </div>
                  <div className={`
                    text-xs mt-1 transition-colors duration-200
                    ${isActive 
                      ? 'text-orange-500' 
                      : isCompleted 
                        ? 'text-green-500' 
                        : 'text-gray-400'
                    }
                  `}>
                    {stepData.description}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Current Step Info */}
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {STEPS[step - 1]?.title}
        </h2>
        <p className="text-gray-600 mt-2">
          {STEPS[step - 1]?.description}
        </p>
      </div>
    </div>
  )
}
