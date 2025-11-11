import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carica le variabili d'ambiente
  const env = loadEnv(mode, '.', '')
  
  return {
    plugins: [react()],
    base: './', // Usa percorsi relativi per Hostinger
    resolve: {
      alias: {
        '@': resolve('./src'),
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'https://enter.takeyourtrade.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
    },
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
    },
    // Definisci le variabili d'ambiente esplicitamente
    define: {
      'import.meta.env.VITE_API_BASE': JSON.stringify(env.VITE_API_BASE || '/api'),
      'import.meta.env.VITE_APP_NAME': JSON.stringify(env.VITE_APP_NAME || 'TakeYourTrade'),
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(env.VITE_APP_VERSION || '1.0.0'),
      'import.meta.env.VITE_DEV_MODE': JSON.stringify(env.VITE_DEV_MODE || 'true'),
    },
  }
})

