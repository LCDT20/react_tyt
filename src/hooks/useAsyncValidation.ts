/**
 * useAsyncValidation
 * Hook per validazioni asincrone con debounce
 */

import { useState, useEffect, useCallback } from 'react'

interface ValidationState {
  isValid: boolean
  isChecking: boolean
  message: string
}

interface UseAsyncValidationOptions {
  debounceMs?: number
  validator: (value: string) => Promise<{ isValid: boolean; message: string }>
  immediateValidation?: (value: string) => { isValid: boolean; message: string } | null
}

export function useAsyncValidation(
  value: string,
  options: UseAsyncValidationOptions
): ValidationState {
  const { debounceMs = 400, validator, immediateValidation } = options
  const [state, setState] = useState<ValidationState>({
    isValid: false,
    isChecking: false,
    message: ''
  })

  const validate = useCallback(async (val: string) => {
    if (!val.trim()) {
      setState({ isValid: false, isChecking: false, message: '' })
      return
    }

    // Check immediate validation first
    if (immediateValidation) {
      const immediateResult = immediateValidation(val)
      if (immediateResult) {
        setState({ ...immediateResult, isChecking: false })
        return
      }
    }

    // Set checking state
    setState({ isValid: false, isChecking: true, message: 'Verificando...' })

    try {
      const result = await validator(val)
      setState({ ...result, isChecking: false })
    } catch (error) {
      setState({
        isValid: false,
        isChecking: false,
        message: 'Errore durante la verifica'
      })
    }
  }, [validator, immediateValidation])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validate(value)
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [value, validate, debounceMs])

  return state
}

// Helper functions per validazioni comuni
export const validators = {
  email: {
    immediate: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return { isValid: false, message: 'Formato email non valido' }
      }
      return null
    },
    async: async (_value: string) => {
      // Mock API call - in real app, call /auth/check-unique?email=...
      await new Promise(resolve => setTimeout(resolve, 1000))
      const isAvailable = Math.random() > 0.3 // 70% chance of being available
      return {
        isValid: isAvailable,
        message: isAvailable ? 'Email disponibile' : 'Email già in uso'
      }
    }
  },

  username: {
    immediate: (value: string) => {
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
      if (!usernameRegex.test(value)) {
        return { 
          isValid: false, 
          message: 'Username deve contenere 3-20 caratteri (lettere, numeri, underscore)' 
        }
      }
      return null
    },
    async: async (_value: string) => {
      // Mock API call - in real app, call /auth/check-unique?username=...
      await new Promise(resolve => setTimeout(resolve, 1000))
      const isAvailable = Math.random() > 0.3 // 70% chance of being available
      return {
        isValid: isAvailable,
        message: isAvailable ? 'Username disponibile' : 'Username già in uso'
      }
    }
  }
}
