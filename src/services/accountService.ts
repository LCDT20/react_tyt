/**
 * Account Service
 * Servizio per gestire le chiamate API dell'account (stubbed per ora)
 */

import type {
  Order,
  UserProfileData,
  Message,
  CartItem,
  ListedArticle,
  WantsListItem,
  MainAddress,
  SecondaryAddress,
  AddressesResponse,
} from '@/types'
import { api } from '@/lib/api'

/**
 * Simula una chiamata API con delay
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Fetch purchase history
 */
export async function fetchPurchaseHistory(
  page: number = 1,
  perPage: number = 25,
  filters?: Record<string, any>
): Promise<{ data: Order[]; current_page: number; last_page: number; total: number; per_page: number }> {
  await delay(500) // Simula network delay

  // Generate fake data
  const totalItems = 127
  const totalPages = Math.ceil(totalItems / perPage)
  const startIdx = (page - 1) * perPage
  const endIdx = Math.min(startIdx + perPage, totalItems)

  const orders: Order[] = []
  for (let i = startIdx; i < endIdx; i++) {
    orders.push({
      id: i + 1,
      order_number: `ORD-${String(i + 1).padStart(6, '0')}`,
      date: new Date(Date.now() - i * 86400000).toISOString(),
      status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'][i % 5] as any,
      seller_username: `Seller${i + 1}`,
      items_count: Math.floor(Math.random() * 10) + 1,
      total_value: Math.floor(Math.random() * 5000) + 100,
    })
  }

  return {
    data: orders,
    current_page: page,
    last_page: totalPages,
    total: totalItems,
    per_page: perPage,
  }
}

/**
 * Fetch sales history
 */
export async function fetchSalesHistory(
  page: number = 1,
  perPage: number = 25,
  filters?: Record<string, any>
): Promise<{ data: Order[]; current_page: number; last_page: number; total: number; per_page: number }> {
  await delay(500)

  const totalItems = 89
  const totalPages = Math.ceil(totalItems / perPage)
  const startIdx = (page - 1) * perPage

  const orders: Order[] = []
  for (let i = startIdx; i < startIdx + perPage && i < totalItems; i++) {
    orders.push({
      id: i + 1,
      order_number: `SAL-${String(i + 1).padStart(6, '0')}`,
      date: new Date(Date.now() - i * 86400000).toISOString(),
      status: ['pending', 'processing', 'shipped', 'delivered'][i % 4] as any,
      buyer_username: `Buyer${i + 1}`,
      items_count: Math.floor(Math.random() * 10) + 1,
      total_value: Math.floor(Math.random() * 5000) + 100,
    })
  }

  return {
    data: orders,
    current_page: page,
    last_page: totalPages,
    total: totalItems,
    per_page: perPage,
  }
}

/**
 * Fetch user profile
 */
export async function fetchUserProfile(): Promise<UserProfileData> {
  await delay(300)

  return {
    id: 1,
    username: 'JohnDoe',
    email: 'john@example.com',
    nome: 'John',
    cognome: 'Doe',
    country: 'IT',
    phone_prefix: '+39',
    telefono: '123456789',
    date_of_birth: '1990-01-01',
    address_street: 'Via Roma 1',
    address_city: 'Milano',
    address_zip: '20100',
    address_country: 'Italy',
    iban: 'IT60X0542811101000000123456',
    seller_type: 'private',
    created_at: new Date().toISOString(),
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(data: Partial<UserProfileData>): Promise<UserProfileData> {
  await delay(500)
  // In futuro chiamerà API
  throw new Error('Not implemented')
}

/**
 * Fetch messages
 */
export async function fetchMessages(
  page: number = 1,
  perPage: number = 25
): Promise<{ data: Message[]; current_page: number; last_page: number; total: number; per_page: number }> {
  await delay(300)

  const totalItems = 45
  const totalPages = Math.ceil(totalItems / perPage)
  const startIdx = (page - 1) * perPage

  const messages: Message[] = []
  for (let i = startIdx; i < startIdx + perPage && i < totalItems; i++) {
    messages.push({
      id: i + 1,
      from_username: `User${i + 1}`,
      subject: `Message ${i + 1}`,
      preview: `This is a preview of message ${i + 1}...`,
      date: new Date(Date.now() - i * 3600000).toISOString(),
      read: i % 3 !== 0,
      conversation_id: Math.floor(i / 3) + 1,
    })
  }

  return {
    data: messages,
    current_page: page,
    last_page: totalPages,
    total: totalItems,
    per_page: perPage,
  }
}

/**
 * Fetch shopping cart items
 */
export async function fetchCartItems(): Promise<CartItem[]> {
  await delay(300)

  return [
    {
      id: 1,
      card_name: 'Lightning Bolt',
      set_name: 'Alpha Edition',
      image_url: 'https://via.placeholder.com/100x140',
      seller_username: 'Seller1',
      condition: 'NM',
      language: 'Italian',
      is_foil: false,
      quantity: 2,
      unit_price: 45.00,
      total_price: 90.00,
    },
    {
      id: 2,
      card_name: 'Black Lotus',
      set_name: 'Beta Edition',
      image_url: 'https://via.placeholder.com/100x140',
      seller_username: 'Seller2',
      condition: 'NM',
      language: 'Italian',
      is_foil: true,
      quantity: 1,
      unit_price: 5000.00,
      total_price: 5000.00,
    },
  ]
}

/**
 * Fetch listed articles
 */
export async function fetchListedArticles(
  page: number = 1,
  perPage: number = 25,
  filters?: Record<string, any>
): Promise<{ data: ListedArticle[]; current_page: number; last_page: number; total: number; per_page: number }> {
  await delay(500)

  const totalItems = 234
  const totalPages = Math.ceil(totalItems / perPage)
  const startIdx = (page - 1) * perPage

  const articles: ListedArticle[] = []
  for (let i = startIdx; i < startIdx + perPage && i < totalItems; i++) {
    articles.push({
      id: i + 1,
      card_name: `Magic Card ${i + 1}`,
      set_name: 'Alpha Edition',
      image_url: 'https://via.placeholder.com/100x140',
      language: 'Italian',
      condition: ['NM', 'SP', 'MP', 'HP'][i % 4] as any,
      is_foil: i % 3 === 0,
      quantity: Math.floor(Math.random() * 5) + 1,
      price: Math.floor(Math.random() * 1000) + 10,
      listed_date: new Date(Date.now() - i * 86400000).toISOString(),
      views: Math.floor(Math.random() * 1000),
      status: ['active', 'paused', 'sold_out'][i % 3] as any,
    })
  }

  return {
    data: articles,
    current_page: page,
    last_page: totalPages,
    total: totalItems,
    per_page: perPage,
  }
}

/**
 * Fetch wants list
 */
export async function fetchWantsList(
  page: number = 1,
  perPage: number = 25
): Promise<{ data: WantsListItem[]; current_page: number; last_page: number; total: number; per_page: number }> {
  await delay(300)

  const totalItems = 12
  const totalPages = Math.ceil(totalItems / perPage)

  const wants: WantsListItem[] = []
  for (let i = 0; i < perPage && i < totalItems; i++) {
    wants.push({
      id: i + 1,
      card_name: `Wanted Card ${i + 1}`,
      set_name: 'Alpha Edition',
      min_condition: 'NM',
      language: 'Italian',
      is_foil: i % 2 === 0,
      max_price: Math.floor(Math.random() * 500) + 10,
      created_at: new Date(Date.now() - i * 86400000).toISOString(),
    })
  }

  return {
    data: wants,
    current_page: 1,
    last_page: totalPages,
    total: totalItems,
    per_page: perPage,
  }
}

/**
 * Update activity status via API
 * PUT /api/profile/activity-status
 */
export async function updateActivityStatusApi(
  activityStatus: 'vacanza' | 'disponibile'
): Promise<{ success: boolean; message?: string }> {
  try {
    // Verifica che il token esista
    const token = localStorage.getItem('tyt_access_token')
    if (!token) {
      throw new Error('Token di autenticazione non trovato. Effettua il login.')
    }

    // Costruisci l'URL completo secondo le specifiche del backend
    const baseURL = import.meta.env.DEV 
      ? '/api' 
      : 'https://enter.takeyourtrade.com/api'
    const url = `${baseURL}/profile/activity-status`

    console.log('🔵 Chiamata API Activity Status:', {
      method: 'PUT',
      url,
      activityStatus,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'N/A'
    })

    // Usa fetch direttamente per avere più controllo e debug
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        activity_status: activityStatus,
      }),
    })

    console.log('📡 Risposta HTTP:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    })

    const data = await response.json()
    console.log('📦 Dati risposta:', data)

    if (!response.ok) {
      // Gestione errori dettagliata
      if (response.status === 404) {
        throw new Error(
          `Endpoint non trovato (404). URL chiamato: ${url}. ` +
          `Verifica che l'endpoint /api/profile/activity-status esista sul backend.`
        )
      } else if (response.status === 401) {
        throw new Error('Token non valido o scaduto. Effettua nuovamente il login.')
      } else if (response.status === 422) {
        const validationErrors = data?.errors
        if (validationErrors) {
          const errorMessages = Object.values(validationErrors).flat().join(', ')
          throw new Error(errorMessages || data.message || 'Errore di validazione')
        }
        throw new Error(data?.message || 'Errore di validazione')
      } else if (response.status >= 500) {
        throw new Error('Errore del server. Riprova più tardi.')
      }
      
      throw new Error(data?.message || `Errore HTTP ${response.status}: ${response.statusText}`)
    }

    // Successo
    if (!data.success) {
      throw new Error(data.message || 'Errore durante l\'aggiornamento dello stato attività')
    }
    
    return {
      success: data.success,
      message: data.message,
    }
  } catch (error: any) {
    console.error('❌ Errore durante l\'aggiornamento dello stato attività:', error)
    
    // Se è già un errore con messaggio, rilancialo
    if (error.message) {
      throw error
    }
    
    // Errore di rete
    if (error.name === 'TypeError' || error.message?.includes('fetch')) {
      throw new Error('Errore di connessione. Verifica la tua connessione internet.')
    }
    
    throw new Error('Errore durante l\'aggiornamento dello stato attività')
  }
}

/**
 * Get user profile
 * GET /api/profile
 */
export async function getUserProfile(): Promise<any> {
  try {
    const response = await api.get('/profile')
    return response.data || response
  } catch (error: any) {
    console.error('Error fetching user profile:', error)
    throw new Error(error.response?.data?.message || error.message || 'Errore durante il caricamento del profilo')
  }
}

/**
 * Complete user profile
 * POST /api/profile/complete
 */
/**
 * Update user password
 * PUT /api/profile/password
 */
export async function updatePassword(data: {
  current_password: string
  password: string
  password_confirmation: string
}): Promise<{ success: boolean; message?: string }> {
  try {
    const token = localStorage.getItem('tyt_access_token')
    if (!token) {
      throw new Error('Token di autenticazione non trovato. Effettua il login.')
    }

    const baseURL = import.meta.env.DEV 
      ? '/api' 
      : 'https://enter.takeyourtrade.com/api'
    const url = `${baseURL}/profile/password`

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const responseData = await response.json()

    if (!response.ok) {
      if (response.status === 422) {
        throw new Error(responseData.message || 'Errore di validazione')
      } else if (response.status === 401) {
        throw new Error('Token non valido o scaduto. Effettua nuovamente il login.')
      } else if (response.status >= 500) {
        throw new Error('Errore del server. Riprova più tardi.')
      }
      throw new Error(responseData.message || `Errore HTTP ${response.status}`)
    }

    if (!responseData.success) {
      throw new Error(responseData.message || 'Errore durante l\'aggiornamento della password')
    }

    return {
      success: responseData.success,
      message: responseData.message,
    }
  } catch (error: any) {
    console.error('Error updating password:', error)
    throw error
  }
}

/**
 * Get all addresses (main + secondary)
 * GET /api/addresses
 */
export async function getAddresses(): Promise<AddressesResponse> {
  try {
    const token = localStorage.getItem('tyt_access_token')
    if (!token) {
      throw new Error('Token di autenticazione non trovato. Effettua il login.')
    }

    const baseURL = import.meta.env.DEV 
      ? '/api' 
      : 'https://enter.takeyourtrade.com/api'
    const url = `${baseURL}/addresses`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token non valido o scaduto. Effettua nuovamente il login.')
      } else if (response.status >= 500) {
        throw new Error('Errore del server. Riprova più tardi.')
      }
      throw new Error(data.message || `Errore HTTP ${response.status}`)
    }

    if (!data.success) {
      throw new Error(data.message || 'Errore durante il caricamento degli indirizzi')
    }

    return data.data
  } catch (error: any) {
    console.error('Error fetching addresses:', error)
    throw error
  }
}

/**
 * Update main address
 * PUT /api/addresses/main
 */
export async function updateMainAddress(data: {
  address: string
  street?: string
  city: string
  postal_code: string
  province: string
  country: string
}): Promise<{ success: boolean; message?: string; data?: { main_address: MainAddress } }> {
  try {
    const token = localStorage.getItem('tyt_access_token')
    if (!token) {
      throw new Error('Token di autenticazione non trovato. Effettua il login.')
    }

    const baseURL = import.meta.env.DEV 
      ? '/api' 
      : 'https://enter.takeyourtrade.com/api'
    const url = `${baseURL}/addresses/main`

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const responseData = await response.json()

    if (!response.ok) {
      if (response.status === 422) {
        throw new Error(responseData.message || 'Errore di validazione')
      } else if (response.status === 401) {
        throw new Error('Token non valido o scaduto. Effettua nuovamente il login.')
      } else if (response.status >= 500) {
        throw new Error('Errore del server. Riprova più tardi.')
      }
      throw new Error(responseData.message || `Errore HTTP ${response.status}`)
    }

    if (!responseData.success) {
      throw new Error(responseData.message || 'Errore durante l\'aggiornamento dell\'indirizzo principale')
    }

    return {
      success: responseData.success,
      message: responseData.message,
      data: responseData.data,
    }
  } catch (error: any) {
    console.error('Error updating main address:', error)
    throw error
  }
}

/**
 * Create secondary address
 * POST /api/addresses
 */
export async function createSecondaryAddress(data: {
  label?: string
  street_address: string
  street_address_2?: string
  city: string
  postal_code: string
  province: string
  country: string
  is_default?: boolean
  address_type?: 'shipping' | 'billing' | 'other'
  notes?: string
}): Promise<{ success: boolean; message?: string; data?: { address: SecondaryAddress } }> {
  try {
    const token = localStorage.getItem('tyt_access_token')
    if (!token) {
      throw new Error('Token di autenticazione non trovato. Effettua il login.')
    }

    const baseURL = import.meta.env.DEV 
      ? '/api' 
      : 'https://enter.takeyourtrade.com/api'
    const url = `${baseURL}/addresses`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const responseData = await response.json()

    if (!response.ok) {
      if (response.status === 422) {
        throw new Error(responseData.message || 'Errore di validazione')
      } else if (response.status === 401) {
        throw new Error('Token non valido o scaduto. Effettua nuovamente il login.')
      } else if (response.status >= 500) {
        throw new Error('Errore del server. Riprova più tardi.')
      }
      throw new Error(responseData.message || `Errore HTTP ${response.status}`)
    }

    if (!responseData.success) {
      throw new Error(responseData.message || 'Errore durante la creazione dell\'indirizzo')
    }

    return {
      success: responseData.success,
      message: responseData.message,
      data: responseData.data,
    }
  } catch (error: any) {
    console.error('Error creating secondary address:', error)
    throw error
  }
}

/**
 * Update secondary address
 * PUT /api/addresses/{id}
 */
export async function updateSecondaryAddress(
  id: number,
  data: {
    label?: string
    street_address?: string
    street_address_2?: string
    city?: string
    postal_code?: string
    province?: string
    country?: string
    is_default?: boolean
    address_type?: 'shipping' | 'billing' | 'other'
    notes?: string
  }
): Promise<{ success: boolean; message?: string; data?: { address: SecondaryAddress } }> {
  try {
    const token = localStorage.getItem('tyt_access_token')
    if (!token) {
      throw new Error('Token di autenticazione non trovato. Effettua il login.')
    }

    const baseURL = import.meta.env.DEV 
      ? '/api' 
      : 'https://enter.takeyourtrade.com/api'
    const url = `${baseURL}/addresses/${id}`

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const responseData = await response.json()

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Indirizzo non trovato')
      } else if (response.status === 422) {
        throw new Error(responseData.message || 'Errore di validazione')
      } else if (response.status === 401) {
        throw new Error('Token non valido o scaduto. Effettua nuovamente il login.')
      } else if (response.status >= 500) {
        throw new Error('Errore del server. Riprova più tardi.')
      }
      throw new Error(responseData.message || `Errore HTTP ${response.status}`)
    }

    if (!responseData.success) {
      throw new Error(responseData.message || 'Errore durante l\'aggiornamento dell\'indirizzo')
    }

    return {
      success: responseData.success,
      message: responseData.message,
      data: responseData.data,
    }
  } catch (error: any) {
    console.error('Error updating secondary address:', error)
    throw error
  }
}

/**
 * Delete secondary address
 * DELETE /api/addresses/{id}
 */
export async function deleteSecondaryAddress(id: number): Promise<{ success: boolean; message?: string }> {
  try {
    const token = localStorage.getItem('tyt_access_token')
    if (!token) {
      throw new Error('Token di autenticazione non trovato. Effettua il login.')
    }

    const baseURL = import.meta.env.DEV 
      ? '/api' 
      : 'https://enter.takeyourtrade.com/api'
    const url = `${baseURL}/addresses/${id}`

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })

    const responseData = await response.json()

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Indirizzo non trovato')
      } else if (response.status === 401) {
        throw new Error('Token non valido o scaduto. Effettua nuovamente il login.')
      } else if (response.status >= 500) {
        throw new Error('Errore del server. Riprova più tardi.')
      }
      throw new Error(responseData.message || `Errore HTTP ${response.status}`)
    }

    if (!responseData.success) {
      throw new Error(responseData.message || 'Errore durante l\'eliminazione dell\'indirizzo')
    }

    return {
      success: responseData.success,
      message: responseData.message,
    }
  } catch (error: any) {
    console.error('Error deleting secondary address:', error)
    throw error
  }
}

/**
 * Complete user profile
 * POST /api/profile/complete
 */
export async function completeProfile(data: {
  birth_date: string
  city: string
  address: string
  street?: string
  postal_code: string
  province: string
  country: string
}): Promise<{ success: boolean; message?: string; data?: any }> {
  try {
    const response = await api.post('/profile/complete', data)
    return {
      success: response.success ?? true,
      message: response.message,
      data: response.data,
    }
  } catch (error: any) {
    console.error('Error completing profile:', error)
    throw new Error(error.response?.data?.message || error.message || 'Errore durante il completamento del profilo')
  }
}




