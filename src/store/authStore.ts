/**
 * Auth Store - Zustand
 * Gestione stato globale dell'autenticazione
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  User, 
  LoginCredentials, 
  RegisterData, 
  VerifyEmailData, 
  ResendVerificationData, 
  PasswordResetRequest, 
  PasswordResetData,
  PasswordResetVerifyToken,
  EmailVerificationSend,
  EmailVerificationVerify
} from '@/types'
import { authApi } from '@/lib/authApi'
import { config } from '@/lib/config'

interface AuthState {
  // State
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  verifyEmail: (data: VerifyEmailData) => Promise<void>
  resendVerification: (data: ResendVerificationData) => Promise<void>
  requestPasswordReset: (data: PasswordResetRequest) => Promise<void>
  verifyPasswordResetToken: (data: PasswordResetVerifyToken) => Promise<boolean>
  resetPassword: (data: PasswordResetData) => Promise<void>
  sendEmailVerification: (data?: EmailVerificationSend) => Promise<void>
  verifyEmailCode: (data: EmailVerificationVerify) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User) => void
  setToken: (accessToken: string, refreshToken?: string) => void
  clearError: () => void
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Initialize auth from localStorage and validate with backend
      initializeAuth: async () => {
        const accessToken = localStorage.getItem(config.auth.tokenKey)
        const refreshToken = localStorage.getItem(config.auth.refreshTokenKey)
        const userStr = localStorage.getItem(config.auth.userKey)
        
        // Se ci sono i token, validiamo la sessione chiamando /api/auth/me
        if (accessToken) {
          try {
            // Imposta il token per le richieste
            authApi.setToken(accessToken)
            
            // Valida la sessione chiamando /api/auth/me
            // L'interceptor gestirà automaticamente il refresh se il token è scaduto
            const response = await authApi.get('/auth/me') as any
            
            // Se la chiamata è andata a buon fine, aggiorna i dati utente
            const user = response.data?.user || response.user || (userStr ? JSON.parse(userStr) : null)
            
            if (user) {
              // Salva i dati utente aggiornati
              localStorage.setItem(config.auth.userKey, JSON.stringify(user))
              
              set({
                user,
                accessToken: accessToken,
                isAuthenticated: true,
              })
            } else {
              // Se non c'è user nella risposta, fai logout
              await get().logout()
            }
          } catch (error) {
            // Se la chiamata fallisce (e anche il refresh fallisce),
            // l'interceptor avrà già fatto il logout forzato
            console.error('Error validating session:', error)
            
            // Se non c'è refresh token o la validazione è fallita, pulisci tutto
            if (!refreshToken) {
              await get().logout()
            }
            // Se c'è refresh token, l'interceptor ha gestito il refresh e il logout se necessario
          }
        } else {
          // Nessun token salvato, assicuriamoci che tutto sia pulito
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
          })
        }
      },

      // Login
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await authApi.post('/auth/login', credentials) as any
          
          // Estrae i dati dalla risposta (supporta sia response.data.data che response.data)
          const responseData = response.data || response
          const accessToken = responseData.access_token || responseData.data?.access_token
          const refreshToken = responseData.refresh_token || responseData.data?.refresh_token
          const user = responseData.user || responseData.data?.user || response.user
          
          if (response.success && accessToken && user) {
            // Salva entrambi i token e user
            authApi.setToken(accessToken, refreshToken)
            localStorage.setItem(config.auth.userKey, JSON.stringify(user))
            
            set({
              user,
              accessToken: accessToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          } else {
            throw new Error(response.message || responseData.message || 'Login fallito')
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Errore durante il login'
          
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
          })
          
          throw error
        }
      },

      // Register
      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null })
        
        try {
          // Log per debug - verifica cosa viene inviato
          console.log('📤 Invio dati registrazione al backend:', {
            ...data,
            password: '***',
            password_confirmation: '***'
          })
          
          const response = await authApi.post('/auth/register', data) as any
          
          console.log('📥 Risposta registrazione:', response)
          
          // Estrae i dati dalla risposta (supporta sia response.data.data che response.data)
          const responseData = response.data || response
          const accessToken = responseData.access_token || responseData.data?.access_token
          const refreshToken = responseData.refresh_token || responseData.data?.refresh_token
          const user = responseData.user || responseData.data?.user
          
          if (response.success) {
            // Se il backend restituisce i token dopo la registrazione, salviamoli
            // (login automatico dopo registrazione)
            if (accessToken && refreshToken && user) {
              authApi.setToken(accessToken, refreshToken)
              localStorage.setItem(config.auth.userKey, JSON.stringify(user))
              
              set({
                user,
                accessToken: accessToken,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              })
            } else {
              // Se non ci sono token, la registrazione è andata a buon fine
              // ma l'utente deve verificare l'email prima di loggarsi
              set({
                isLoading: false,
                error: null,
              })
            }
          } else {
            throw new Error(response.message || responseData.message || 'Registrazione fallita')
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Errore durante la registrazione'
          
          set({
            isLoading: false,
            error: errorMessage,
          })
          
          throw error
        }
      },

      // Verify Email
      verifyEmail: async (data: VerifyEmailData) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await authApi.post<{ user: User }>('/auth/verify-email', data)
          
          if (response.success && response.data) {
            set({
              isLoading: false,
              error: null,
            })
          } else {
            throw new Error(response.message || 'Verifica email fallita')
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Errore durante la verifica email'
          
          set({
            isLoading: false,
            error: errorMessage,
          })
          
          throw error
        }
      },

      // Resend Verification
      resendVerification: async (data: ResendVerificationData) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await authApi.post('/auth/verify-email/resend', data)
          
          if (response.success) {
            set({
              isLoading: false,
              error: null,
            })
          } else {
            throw new Error(response.message || 'Invio email fallito')
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Errore durante l\'invio email'
          
          set({
            isLoading: false,
            error: errorMessage,
          })
          
          throw error
        }
      },

      // Request Password Reset
      requestPasswordReset: async (data: PasswordResetRequest) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await authApi.post('/auth/password/request-reset', data)
          
          if (response.success) {
            set({
              isLoading: false,
              error: null,
            })
          } else {
            throw new Error(response.message || 'Richiesta reset fallita')
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Errore durante la richiesta reset'
          
          set({
            isLoading: false,
            error: errorMessage,
          })
          
          throw error
        }
      },

      // Verify Password Reset Token
      verifyPasswordResetToken: async (data: PasswordResetVerifyToken): Promise<boolean> => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await authApi.post('/auth/password/verify-token', data) as any
          
          set({
            isLoading: false,
            error: null,
          })
          
          // La risposta ha success: true anche se il token non è valido (valid: false)
          return response.valid === true
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Errore durante la verifica token'
          
          set({
            isLoading: false,
            error: errorMessage,
          })
          
          return false
        }
      },

      // Reset Password
      resetPassword: async (data: PasswordResetData) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await authApi.post('/auth/password/reset', {
            email: data.email,
            token: data.token,
            password: data.password,
            password_confirmation: data.password_confirmation
          }) as any
          
          // Log della risposta per debug
          console.log('Reset password response:', response)
          
          // Controlla se ci sono errori di validazione nella risposta
          if (response.errors && Object.keys(response.errors).length > 0) {
            const errorMessages = Object.values(response.errors).flat().join(', ')
            const errorMessage = errorMessages || response.message || 'Errore durante il reset password'
            
            set({
              isLoading: false,
              error: errorMessage,
            })
            
            throw new Error(errorMessage)
          }
          
          // Controlla se la risposta indica successo
          if (response.success === false || (response.success === undefined && response.message)) {
            const errorMessage = response.message || 'Reset password fallito'
            
            set({
              isLoading: false,
              error: errorMessage,
            })
            
            throw new Error(errorMessage)
          }
          
          // Successo
          set({
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          console.error('Reset password error details:', error)
          
          // Gestisci errori di validazione Laravel/Lumen
          let errorMessage = 'Errore durante il reset password'
          
          if (error.response?.data) {
            const errorData = error.response.data
            
            // Se ci sono errori di validazione
            if (errorData.errors && typeof errorData.errors === 'object') {
              const validationErrors = Object.values(errorData.errors).flat()
              errorMessage = validationErrors.join(', ')
            } else if (errorData.message) {
              errorMessage = errorData.message
            }
          } else if (error.message) {
            errorMessage = error.message
          }
          
          set({
            isLoading: false,
            error: errorMessage,
          })
          
          throw error
        }
      },

      // Send Email Verification Code
      sendEmailVerification: async (data?: EmailVerificationSend) => {
        set({ isLoading: true, error: null })
        
        try {
          // Se l'utente è autenticato, non serve passare email (viene presa dal token)
          const response = await authApi.post('/auth/email/send-verification', data || {})
          
          if (response.success) {
            set({
              isLoading: false,
              error: null,
            })
          } else {
            throw new Error(response.message || 'Invio codice verifica fallito')
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Errore durante l\'invio codice verifica'
          
          set({
            isLoading: false,
            error: errorMessage,
          })
          
          throw error
        }
      },

      // Verify Email Code
      verifyEmailCode: async (data: EmailVerificationVerify) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await authApi.post('/auth/email/verify', data) as any
          
          if (response.success && response.user) {
            // Aggiorna i dati utente con la nuova verifica
            const updatedUser = response.user || response.data?.user
            if (updatedUser) {
              localStorage.setItem(config.auth.userKey, JSON.stringify(updatedUser))
              set({
                user: updatedUser,
                isLoading: false,
                error: null,
              })
            } else {
              set({
                isLoading: false,
                error: null,
              })
            }
          } else {
            throw new Error(response.message || 'Verifica codice fallita')
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Errore durante la verifica codice'
          
          set({
            isLoading: false,
            error: errorMessage,
          })
          
          throw error
        }
      },

      // Logout
      logout: async () => {
        const accessToken = localStorage.getItem(config.auth.tokenKey)
        
        // Chiama l'endpoint di logout per invalidare la sessione sul server
        if (accessToken) {
          try {
            await authApi.post('/auth/logout', {})
          } catch (error) {
            // Anche se il logout fallisce, procediamo con la pulizia client-side
            console.warn('Logout API call failed, but continuing with client-side cleanup:', error)
          }
        }
        
        // Pulisci i token e lo stato (anche se il logout API è fallito)
        authApi.clearToken()
        
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          error: null,
        })
      },

      // Set user
      setUser: (user: User) => {
        localStorage.setItem(config.auth.userKey, JSON.stringify(user))
        set({ user })
      },

      // Set token
      setToken: (accessToken: string, refreshToken?: string) => {
        authApi.setToken(accessToken, refreshToken)
        set({ accessToken: accessToken, isAuthenticated: true })
      },

      // Clear error
      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

