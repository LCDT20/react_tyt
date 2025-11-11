/**
 * Register Store - Zustand
 * Gestione stato temporaneo del wizard di registrazione
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Tipi per i dati di registrazione
export interface CountryData {
  code: string
  name: string
  phone_prefix: string
  vat_prefix: string
  flag: string
}

export interface RegisterState {
  // Step 1 - Paese
  country: string
  phone_prefix: string
  vat_prefix: string
  
  // Step 2 - Tipo Account
  account_type: 'personal' | 'business' | null
  
  // Step 3 - Dati Identità (dinamici)
  // Personale
  nome?: string
  cognome?: string
  // Business
  ragione_sociale?: string
  piva?: string
  
  // Step 4 - Contatti
  phone?: string
  email?: string
  
  // Step 5 - Credenziali & Termini
  username?: string
  password?: string
  password_confirmation?: string
  termsAccepted: boolean
  privacyAccepted: boolean
  cancellationAccepted: boolean
  adultConfirmed: boolean
  
  // Helpers
  step: 1 | 2 | 3 | 4 | 5
  isLoading: boolean
  errors: Record<string, string[]>
  
  // Actions
  set<K extends keyof RegisterState>(key: K, value: RegisterState[K]): void
  setCountry: (country: string, phone_prefix: string, vat_prefix: string) => void
  setAccountType: (type: 'personal' | 'business') => void
  setPersonalData: (nome: string, cognome: string) => void
  setBusinessData: (ragione_sociale: string, piva: string) => void
  setContacts: (phone: string, email: string) => void
  setCredentials: (username: string, password: string, password_confirmation: string) => void
  setTerms: (terms: boolean, privacy: boolean, cancellation: boolean, adult: boolean) => void
  next: () => void
  prev: () => void
  reset: () => void
  setError: (field: string, message: string) => void
  clearError: (field: string) => void
  clearAllErrors: () => void
  setLoading: (loading: boolean) => void
}

// Dati paesi supportati
export const COUNTRIES: CountryData[] = [
  { code: 'IT', name: 'Italia', phone_prefix: '+39', vat_prefix: 'IT', flag: '🇮🇹' },
  { code: 'FR', name: 'Francia', phone_prefix: '+33', vat_prefix: 'FR', flag: '🇫🇷' },
  { code: 'DE', name: 'Germania', phone_prefix: '+49', vat_prefix: 'DE', flag: '🇩🇪' },
  { code: 'ES', name: 'Spagna', phone_prefix: '+34', vat_prefix: 'ES', flag: '🇪🇸' },
  { code: 'GB', name: 'Regno Unito', phone_prefix: '+44', vat_prefix: 'GB', flag: '🇬🇧' },
  { code: 'US', name: 'Stati Uniti', phone_prefix: '+1', vat_prefix: 'US', flag: '🇺🇸' },
  { code: 'CH', name: 'Svizzera', phone_prefix: '+41', vat_prefix: 'CH', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', phone_prefix: '+43', vat_prefix: 'AT', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgio', phone_prefix: '+32', vat_prefix: 'BE', flag: '🇧🇪' },
  { code: 'NL', name: 'Paesi Bassi', phone_prefix: '+31', vat_prefix: 'NL', flag: '🇳🇱' },
]

export const useRegisterStore = create<RegisterState>()(
  persist(
    (set, get) => ({
      // Initial State
      country: '',
      phone_prefix: '',
      vat_prefix: '',
      account_type: null,
      nome: '',
      cognome: '',
      ragione_sociale: '',
      piva: '',
      phone: '',
      email: '',
      username: '',
      password: '',
      password_confirmation: '',
      termsAccepted: false,
      privacyAccepted: false,
      cancellationAccepted: false,
      adultConfirmed: false,
      step: 1,
      isLoading: false,
      errors: {},

      // Generic setter
      set: (key, value) => set({ [key]: value }),

      // Set country with prefixes
      setCountry: (country, phone_prefix, vat_prefix) => {
        set({ country, phone_prefix, vat_prefix })
      },

      // Set account type
      setAccountType: (account_type) => {
        set({ account_type })
        // Clear identity data when changing account type
        set({ 
          nome: '', 
          cognome: '', 
          ragione_sociale: '', 
          piva: '' 
        })
      },

      // Set personal data
      setPersonalData: (nome, cognome) => {
        set({ nome, cognome })
      },

      // Set business data
      setBusinessData: (ragione_sociale, piva) => {
        set({ ragione_sociale, piva })
      },

      // Set contacts
      setContacts: (phone, email) => {
        set({ phone, email })
      },

      // Set credentials
      setCredentials: (username, password, password_confirmation) => {
        set({ username, password, password_confirmation })
      },

      // Set terms
      setTerms: (termsAccepted, privacyAccepted, cancellationAccepted, adultConfirmed) => {
        set({ termsAccepted, privacyAccepted, cancellationAccepted, adultConfirmed })
      },

      // Navigation
      next: () => {
        const { step } = get()
        if (step < 5) {
          set({ step: (step + 1) as 1 | 2 | 3 | 4 | 5 })
        }
      },

      prev: () => {
        const { step } = get()
        if (step > 1) {
          set({ step: (step - 1) as 1 | 2 | 3 | 4 | 5 })
        }
      },

      // Reset all data
      reset: () => {
        set({
          country: '',
          phone_prefix: '',
          vat_prefix: '',
          account_type: null,
          nome: '',
          cognome: '',
          ragione_sociale: '',
          piva: '',
          phone: '',
          email: '',
          username: '',
          password: '',
          password_confirmation: '',
          termsAccepted: false,
          privacyAccepted: false,
          cancellationAccepted: false,
          adultConfirmed: false,
          step: 1,
          isLoading: false,
          errors: {},
        })
      },

      // Error management
      setError: (field, message) => {
        const { errors } = get()
        set({ 
          errors: { 
            ...errors, 
            [field]: [message] 
          } 
        })
      },

      clearError: (field) => {
        const { errors } = get()
        const newErrors = { ...errors }
        delete newErrors[field]
        set({ errors: newErrors })
      },

      clearAllErrors: () => {
        set({ errors: {} })
      },

      // Loading state
      setLoading: (isLoading) => {
        set({ isLoading })
      },
    }),
    {
      name: 'register-storage',
      partialize: (state) => ({
        country: state.country,
        phone_prefix: state.phone_prefix,
        vat_prefix: state.vat_prefix,
        account_type: state.account_type,
        nome: state.nome,
        cognome: state.cognome,
        ragione_sociale: state.ragione_sociale,
        piva: state.piva,
        phone: state.phone,
        email: state.email,
        username: state.username,
        step: state.step,
      }),
    }
  )
)

// Helper functions per validazioni
export const validateStep = (step: number, state: RegisterState): boolean => {
  switch (step) {
    case 1:
      return !!state.country && !!state.phone_prefix && !!state.vat_prefix
    
    case 2:
      return state.account_type === 'personal' || state.account_type === 'business'
    
    case 3:
      if (state.account_type === 'personal') {
        return !!state.nome && !!state.cognome
      } else if (state.account_type === 'business') {
        return !!state.ragione_sociale && !!state.piva
      }
      return false
    
    case 4:
      return !!state.phone && !!state.email
    
    case 5:
      return !!state.username && 
             !!state.password && 
             !!state.password_confirmation &&
             state.termsAccepted &&
             state.privacyAccepted &&
             state.cancellationAccepted &&
             state.adultConfirmed
    
    default:
      return false
  }
}

// Password validation regex (legacy policy)
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/

// Email validation
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Phone validation (basic)
export const PHONE_REGEX = /^[\d\s\-\+\(\)]+$/

// Username validation (alphanumeric + underscore, 3-20 chars)
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/
