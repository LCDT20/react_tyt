/**
 * Collection Store - Zustand
 * Gestione stato globale della collezione
 */

import { create } from 'zustand'
import type { CollectionItem, CollectionFilters, CollectionPagination } from '@/types'
import { collectionService } from '@/services/collectionService'

interface CollectionState {
  // State
  items: CollectionItem[]
  isLoading: boolean
  error: string | null
  filters: CollectionFilters
  searchQuery: string
  pagination: CollectionPagination
  
  // Actions
  fetchCollection: (page?: number, perPage?: number) => Promise<void>
  addItem: (data: Partial<CollectionItem>) => Promise<void>
  updateItem: (id: string, data: Partial<CollectionItem>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  setFilters: (filters: CollectionFilters) => void
  setSearchQuery: (query: string) => void
  clearFilters: () => void
  clearError: () => void
}

const defaultFilters: CollectionFilters = {
  condition: [],
  language: [],
  is_foil: null,
  source: [],
  search: undefined,
}

export const useCollectionStore = create<CollectionState>((set, get) => ({
  // Initial State
  items: [],
  isLoading: false,
  error: null,
  filters: defaultFilters,
  searchQuery: '',
  pagination: {
    page: 1,
    per_page: 50,
    total: 0,
    total_pages: 1,
  },

  // Fetch collection items
  fetchCollection: async (page = 1, perPage = 50) => {
    set({ isLoading: true, error: null })
    
    try {
      const { filters, searchQuery } = get()
      
      // Include search query in filters if present
      const filtersWithSearch = searchQuery
        ? { ...filters, search: searchQuery }
        : filters
      
      const response = await collectionService.fetchCollectionItems(page, perPage, filtersWithSearch)
      
      if (response.success && response.data) {
        set({
          items: response.data.items,
          pagination: {
            page: response.data.page,
            per_page: response.data.per_page,
            total: response.data.total,
            total_pages: response.data.total_pages,
          },
          isLoading: false,
          error: null,
        })
      } else {
        throw new Error(response.message || 'Errore nel recupero della collezione')
      }
    } catch (error: any) {
      let errorMessage = 'Errore durante il caricamento della collezione'
      
      if (error.response?.status === 503) {
        errorMessage = 'Il servizio di collezione non è disponibile al momento. Riprova più tardi.'
      } else if (error.response?.status === 500) {
        errorMessage = 'Errore del server. Riprova più tardi.'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      set({
        isLoading: false,
        error: errorMessage,
        items: [],
      })
      
      throw error
    }
  },

  // Add item
  addItem: async (data: Partial<CollectionItem>) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await collectionService.createCollectionItem(data)
      
      if (response.success && response.data) {
        // Refresh collection
        await get().fetchCollection(get().pagination.page, get().pagination.per_page)
      } else {
        throw new Error(response.message || 'Errore nell\'aggiunta della carta')
      }
    } catch (error: any) {
      let errorMessage = 'Errore durante l\'aggiunta della carta'
      
      if (error.response?.status === 503) {
        errorMessage = 'Il servizio non è disponibile. Riprova più tardi.'
      } else if (error.response?.status === 500) {
        errorMessage = 'Errore del server. Riprova più tardi.'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
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

  // Update item
  updateItem: async (id: string, data: Partial<CollectionItem>) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await collectionService.updateCollectionItem(id, data)
      
      if (response.success && response.data) {
        // Refresh collection
        await get().fetchCollection(get().pagination.page, get().pagination.per_page)
      } else {
        throw new Error(response.message || 'Errore nell\'aggiornamento della carta')
      }
    } catch (error: any) {
      let errorMessage = 'Errore durante l\'aggiornamento della carta'
      
      if (error.response?.status === 503) {
        errorMessage = 'Il servizio non è disponibile. Riprova più tardi.'
      } else if (error.response?.status === 500) {
        errorMessage = 'Errore del server. Riprova più tardi.'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
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

  // Delete item
  deleteItem: async (id: string) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await collectionService.deleteCollectionItem(id)
      
      if (response.success) {
        // Refresh collection
        await get().fetchCollection(get().pagination.page, get().pagination.per_page)
      } else {
        throw new Error(response.message || 'Errore nell\'eliminazione della carta')
      }
    } catch (error: any) {
      let errorMessage = 'Errore durante l\'eliminazione della carta'
      
      if (error.response?.status === 503) {
        errorMessage = 'Il servizio non è disponibile. Riprova più tardi.'
      } else if (error.response?.status === 500) {
        errorMessage = 'Errore del server. Riprova più tardi.'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
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

  // Set filters
  setFilters: (filters: CollectionFilters) => {
    set({ filters, pagination: { ...get().pagination, page: 1 } })
  },

  // Set search query
  setSearchQuery: (query: string) => {
    set({ searchQuery: query, pagination: { ...get().pagination, page: 1 } })
  },

  // Clear filters
  clearFilters: () => {
    set({ 
      filters: defaultFilters, 
      searchQuery: '',
      pagination: { ...get().pagination, page: 1 } 
    })
  },

  // Clear error
  clearError: () => {
    set({ error: null })
  },
}))

