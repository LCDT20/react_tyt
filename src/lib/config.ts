/**
 * Application Configuration
 * Gestisce tutte le variabili di ambiente e configurazioni globali
 */

// Production configuration

// Determina l'URL base in base all'ambiente
const isDevelopment = import.meta.env.DEV
const apiBaseURL = isDevelopment 
  ? '/api'  // Usa il proxy locale in sviluppo
  : 'https://enter.takeyourtrade.com/api'  // URL diretto del backend in produzione

// Fallback URL per test di connettività
const fallbackURL = 'https://enter.takeyourtrade.com/api'

export const config = {
  api: {
    baseURL: apiBaseURL,
    fallbackURL: fallbackURL,
    timeout: 30000, // 30 secondi
  },
  auth: {
    baseURL: apiBaseURL,
    fallbackURL: fallbackURL,
    tokenKey: 'tyt_access_token',
    refreshTokenKey: 'tyt_refresh_token',
    userKey: 'tyt_user',
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Take Your Trade',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
  debug: {
    isDevelopment,
    showNetworkErrors: true,
  }
} as const

// Production ready

export default config

