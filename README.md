# Take Your Trade - Frontend

## 📋 Panoramica

**Take Your Trade** è una piattaforma web per il trading di carte Magic: The Gathering, sviluppata con React 18, TypeScript e Vite. Il frontend si integra con un backend microservizi per fornire un'esperienza completa di gestione collezioni, ricerca carte e trading.

## 🏗️ Architettura

### Stack Tecnologico

- **Frontend Framework**: React 18.2.0 con TypeScript
- **Build Tool**: Vite 5.0.11
- **Routing**: React Router DOM 6.21.1
- **State Management**: Zustand 4.4.7
- **HTTP Client**: Axios 1.6.5
- **UI/UX**: Tailwind CSS 3.4.1 + Framer Motion 10.18.0
- **Icons**: Lucide React 0.303.0

### Struttura del Progetto

```
src/
├── app/                    # Configurazione routing e layout
│   ├── MainLayout.tsx     # Layout principale dell'app
│   └── Router.tsx         # Configurazione delle route
├── components/            # Componenti riutilizzabili
│   ├── header/           # Componenti header e navigazione
│   ├── ui/               # Componenti UI base
│   ├── register/         # Componenti per registrazione
│   └── debug/            # Componenti per debug
├── pages/                # Pagine dell'applicazione
│   ├── Auth/             # Pagine di autenticazione
│   ├── Cards/            # Pagine per gestione carte
│   ├── Dashboard/        # Dashboard utente
│   └── Admin/            # Area amministrativa
├── store/                # Store Zustand
│   ├── authStore.ts      # Store per autenticazione
│   └── registerStore.ts  # Store per registrazione
├── lib/                  # Librerie e configurazioni
│   ├── api.ts           # Client API principale
│   ├── authApi.ts       # Client API autenticazione
│   └── config.ts        # Configurazioni globali
├── hooks/                # Custom React hooks
├── types/                # Definizioni TypeScript
└── utils/                # Utility functions
```

## 🔐 Sistema di Autenticazione

### Architettura JWT

Il frontend implementa un sistema di autenticazione basato su **JWT (JSON Web Tokens)** con le seguenti caratteristiche:

#### 1. **Dual API Architecture**
- **`authApi`**: Client dedicato per operazioni di autenticazione
- **`api`**: Client generale per tutte le altre operazioni API

#### 2. **Gestione Token**
```typescript
// Configurazione token
const config = {
  auth: {
    baseURL: 'https://enter.takeyourtrade.com/api',
    tokenKey: 'tyt_token',      // Chiave localStorage per token
    userKey: 'tyt_user',        // Chiave localStorage per dati utente
  }
}
```

#### 3. **Flusso di Autenticazione**

**Login:**
1. L'utente inserisce credenziali
2. `authApi.post('/auth/login', credentials)` invia richiesta
3. Il backend restituisce `{ access_token, user }`
4. Il token viene salvato in localStorage
5. Lo stato globale viene aggiornato con `useAuthStore`

**Logout:**
1. Token e dati utente vengono rimossi da localStorage
2. Stato globale viene resettato
3. Redirect automatico alla pagina di login

#### 4. **Protezione Route**
```typescript
// Componente ProtectedRoute
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}
```

### Interceptors Axios

#### Request Interceptor
```typescript
// Aggiunge automaticamente il token JWT a tutte le richieste
this.instance.interceptors.request.use((config) => {
  if (this.token && config.headers) {
    config.headers.Authorization = `Bearer ${this.token}`
  }
  return config
})
```

#### Response Interceptor
```typescript
// Gestisce errori di autenticazione globalmente
this.instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token scaduto o non valido
      this.clearToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

## 🗄️ State Management

### Zustand Store

Il frontend utilizza **Zustand** per la gestione dello stato globale con persistenza:

```typescript
// authStore.ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Stato
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // Azioni
      login: async (credentials) => { /* ... */ },
      register: async (data) => { /* ... */ },
      logout: () => { /* ... */ },
      // ...
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
```

### Persistenza Dati

- **localStorage**: Token JWT e dati utente
- **Zustand persist**: Sincronizzazione automatica stato/localStorage
- **Inizializzazione**: Caricamento automatico stato all'avvio app

## 🌐 Integrazione Backend

### Configurazione API

```typescript
// config.ts
const isDevelopment = import.meta.env.DEV
const apiBaseURL = isDevelopment 
  ? '/api'  // Proxy locale in sviluppo
  : 'https://enter.takeyourtrade.com/api'  // URL diretto in produzione
```

### Proxy di Sviluppo

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'https://enter.takeyourtrade.com',
      changeOrigin: true,
      secure: true,
      rewrite: (path) => path.replace(/^\/api/, '/api'),
    },
  },
}
```

### Endpoints Principali

#### Autenticazione
- `POST /auth/login` - Login utente
- `POST /auth/register` - Registrazione utente
- `POST /auth/verify-email` - Verifica email
- `POST /auth/password/email` - Richiesta reset password
- `POST /auth/password/reset` - Reset password

#### Carte e Collezioni
- `GET /cards/search` - Ricerca carte
- `GET /cards/:id` - Dettaglio carta
- `GET /collection` - Collezione utente
- `POST /collection` - Aggiungi carta alla collezione

## 🎨 Design System

### Stile Apple-like
Il frontend implementa un design minimalista ispirato ad Apple con:
- **Colori**: Palette limitata e coerente
- **Tipografia**: Inter font family
- **Spacing**: Sistema di spacing consistente
- **Componenti**: Design pulito e funzionale

### Tailwind CSS
- Configurazione personalizzata
- Utility classes per styling rapido
- Responsive design mobile-first
- Dark mode support (futuro)

## 🚀 Build e Deploy

### Scripts Disponibili

```json
{
  "dev": "vite",                    // Sviluppo locale
  "build": "tsc && vite build",     // Build produzione
  "build:prod": "tsc && vite build --mode production",
  "preview": "vite preview",        // Anteprima build
  "lint": "eslint . --ext ts,tsx",  // Linting
  "clean": "rimraf dist"            // Pulizia build
}
```

### Configurazione Build

```typescript
// vite.config.ts
build: {
  outDir: 'dist',
  assetsDir: 'assets',
  sourcemap: false,
  minify: 'terser',
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        router: ['react-router-dom'],
        ui: ['lucide-react', 'framer-motion'],
        store: ['zustand'],
      },
    },
  },
}
```

## 🔧 Sviluppo

### Prerequisiti
- Node.js 18+
- npm o yarn

### Installazione
```bash
npm install
```

### Sviluppo Locale
```bash
npm run dev
```

### Build Produzione
```bash
npm run build:prod
```

## 📱 Funzionalità Principali

### Pubbliche
- **Homepage**: Landing page con presentazione
- **Login/Register**: Autenticazione utenti
- **Verifica Email**: Sistema di verifica
- **Reset Password**: Recupero password
- **Health Check**: Monitoraggio stato API

### Protette (Richiedono Login)
- **Dashboard**: Pannello utente principale
- **Collezione**: Gestione carte personali
- **Ricerca Carte**: Sistema di ricerca avanzata
- **Social Feed**: Feed social per trading
- **Chat**: Sistema di messaggistica
- **Admin**: Area amministrativa

## 🔒 Sicurezza

### Misure Implementate
- **JWT Token**: Autenticazione stateless sicura
- **HTTPS Only**: Comunicazione criptata
- **CORS**: Configurazione corretta per cross-origin
- **Token Expiry**: Gestione automatica scadenza token
- **Input Validation**: Validazione lato client e server
- **XSS Protection**: Sanitizzazione input utente

### Best Practices
- Token non esposti in console
- Logout automatico su errori 401
- Validazione form real-time
- Gestione errori centralizzata

## 🐛 Debug e Monitoring

### Strumenti Debug
- **SearchDebug**: Componente per debug ricerca
- **Console Logs**: Logging dettagliato errori
- **Network Monitoring**: Interceptor Axios per monitoraggio
- **Health Check**: Endpoint per verifica stato

### File di Test
- `test-*.html`: File di test per varie funzionalità
- `debug-search.js`: Script debug per ricerca
- `verify-fix.html`: Verifica correzioni

## 📈 Performance

### Ottimizzazioni
- **Code Splitting**: Chunk separati per vendor libraries
- **Lazy Loading**: Caricamento lazy delle route
- **Tree Shaking**: Eliminazione codice non utilizzato
- **Minification**: Compressione codice produzione
- **Caching**: Gestione cache browser

### Bundle Analysis
- Vendor chunks separati
- CSS purging automatico
- Asset optimization
- Source maps disabilitati in produzione

## 🔄 Integrazione Continua

### Workflow
1. **Sviluppo**: `npm run dev`
2. **Testing**: `npm run lint`
3. **Build**: `npm run build:prod`
4. **Deploy**: Upload su Hostinger

### Configurazione Produzione
- Variabili ambiente in `env.production`
- URL API configurati per produzione
- Build ottimizzato per performance

---

## 📞 Supporto

Per domande o supporto tecnico, contattare il team di sviluppo.

**Versione**: 1.0.0  
**Ultimo aggiornamento**: Dicembre 2024