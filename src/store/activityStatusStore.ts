/**
 * Activity Status Store - Zustand
 * Gestione stato globale dello stato attività dell'utente
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { updateActivityStatusApi } from '@/services/accountService'

export type ActivityStatus = 'disponibile' | 'vacanza'

interface ActivityStatusState {
  // State
  activityStatus: ActivityStatus | null
  isLoading: boolean
  error: string | null

  // Actions
  setActivityStatus: (status: ActivityStatus) => void
  updateActivityStatus: (status: ActivityStatus) => Promise<void>
  clearError: () => void
  initializeActivityStatus: () => void
}

export const useActivityStatusStore = create<ActivityStatusState>()(
  persist(
    (set, get) => ({
      // Initial State
      activityStatus: null,
      isLoading: false,
      error: null,

      // Initialize activity status from localStorage
      initializeActivityStatus: () => {
        const savedStatus = localStorage.getItem('tyt_activity_status')
        if (savedStatus && (savedStatus === 'disponibile' || savedStatus === 'vacanza')) {
          set({ activityStatus: savedStatus as ActivityStatus })
        }
      },

      // Set activity status (local only)
      setActivityStatus: (status: ActivityStatus) => {
        localStorage.setItem('tyt_activity_status', status)
        set({ activityStatus: status })
      },

      // Update activity status via API
      updateActivityStatus: async (status: ActivityStatus) => {
        set({ isLoading: true, error: null })
        
        try {
          await updateActivityStatusApi(status)
          
          // On success, update local state
          localStorage.setItem('tyt_activity_status', status)
          set({
            activityStatus: status,
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          const errorMessage = error.message || 'Errore durante l\'aggiornamento dello stato attività'
          
          set({
            isLoading: false,
            error: errorMessage,
          })
          
          throw error
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'activity-status-storage',
      partialize: (state) => ({
        activityStatus: state.activityStatus,
      }),
    }
  )
)

