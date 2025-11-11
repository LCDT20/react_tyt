/**
 * Account Types
 * TypeScript definitions for account-related data structures
 */

export interface UserProfileData {
  fullName: string
  accountType: 'Privato' | 'Business'
  registrationDate: string
  birthDate: string
  activityStatus: string
  mainAddress: {
    name: string
    street: string
    city: string
    country: string
  }
  balance: number
  email?: string
  phone?: string
  password?: string
  fiscalCode?: string
  birthPlace?: string
}

/**
 * Account Types
 * TypeScript definitions for account-related data structures
 */

export interface UserProfileData {
  fullName: string
  accountType: 'Privato' | 'Business'
  registrationDate: string
  birthDate: string
  activityStatus: string
  mainAddress: {
    name: string
    street: string
    city: string
    country: string
  }
  balance: number
  email?: string
  phone?: string
  password?: string
  fiscalCode?: string
  birthPlace?: string
}

export interface MainAddress {
  id: 'main'
  type: 'main'
  label: string
  location: string
  city: string
  country: string
  created_at?: string
  updated_at?: string
}

export interface SecondaryAddress {
  id: number
  type: 'secondary'
  label?: string
  street_address: string
  street_address_2?: string
  city: string
  postal_code: string
  province: string
  country: string
  full_location: string
  is_default: boolean
  address_type: 'shipping' | 'billing' | 'other'
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface AddressesResponse {
  main_address: MainAddress
  secondary_addresses: SecondaryAddress[]
  total_addresses: number
}

export interface Address {
  id: number
  name: string
  street: string
  city: string
  zipCode: string
  country: string
  isDefault: boolean
}

export interface Transaction {
  id: number
  type: 'purchase' | 'sale' | 'withdrawal' | 'deposit'
  amount: number
  description: string
  date: string
  status: 'completed' | 'pending' | 'failed'
}

export interface Coupon {
  id: number
  code: string
  discount: number
  discountType: 'percentage' | 'fixed'
  validUntil: string
  isUsed: boolean
}

export interface Transaction {
  id: number
  type: 'purchase' | 'sale' | 'withdrawal' | 'deposit'
  amount: number
  description: string
  date: string
  status: 'completed' | 'pending' | 'failed'
}

export interface Coupon {
  id: number
  code: string
  discount: number
  discountType: 'percentage' | 'fixed'
  validUntil: string
  isUsed: boolean
}
