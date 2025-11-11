/**
 * Validation Utilities
 * Funzioni di utilità per validazioni comuni
 */

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Username validation
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

// Password validation (legacy policy)
export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/
  return passwordRegex.test(password) && password.length >= 8
}

// Phone validation (basic)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

// P.IVA validation (Italian format)
export const isValidPIVA = (piva: string): boolean => {
  const pivaRegex = /^[0-9]{11}$/
  return pivaRegex.test(piva)
}

// Password strength calculation
export const getPasswordStrength = (password: string) => {
  if (!password) return { score: 0, label: 'Molto debole', color: 'bg-red-500' }
  
  let score = 0
  if (password.length >= 8) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z\d]/.test(password)) score++
  
  const strength = [
    { score: 0, label: 'Molto debole', color: 'bg-red-500' },
    { score: 1, label: 'Debole', color: 'bg-red-400' },
    { score: 2, label: 'Discreta', color: 'bg-yellow-400' },
    { score: 3, label: 'Buona', color: 'bg-yellow-500' },
    { score: 4, label: 'Forte', color: 'bg-green-400' },
    { score: 5, label: 'Molto forte', color: 'bg-green-500' },
  ]
  
  return strength[Math.min(score, 5)]
}

// Form validation helpers
export const validateFormField = (field: string, value: string, rules: any) => {
  const errors: string[] = []
  
  if (rules.required && !value.trim()) {
    errors.push(`${field} è obbligatorio`)
  }
  
  if (value.trim()) {
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`${field} deve essere di almeno ${rules.minLength} caratteri`)
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`${field} deve essere di massimo ${rules.maxLength} caratteri`)
    }
    
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(rules.message || `${field} non è valido`)
    }
  }
  
  return errors
}

// Country validation
export const validateCountry = (country: string): boolean => {
  const validCountries = ['IT', 'FR', 'DE', 'ES', 'GB', 'US', 'CH', 'AT', 'BE', 'NL']
  return validCountries.includes(country)
}

// Account type validation
export const validateAccountType = (type: string): boolean => {
  return type === 'personal' || type === 'business'
}

// Terms validation
export const validateTerms = (terms: {
  termsAccepted: boolean
  privacyAccepted: boolean
  cancellationAccepted: boolean
  adultConfirmed: boolean
}): boolean => {
  return terms.termsAccepted && 
         terms.privacyAccepted && 
         terms.cancellationAccepted && 
         terms.adultConfirmed
}

// Complete form validation
export const validateRegistrationForm = (data: any) => {
  const errors: Record<string, string[]> = {}
  
  // Country validation
  if (!validateCountry(data.country)) {
    errors.country = ['Paese non valido']
  }
  
  // Account type validation
  if (!validateAccountType(data.account_type)) {
    errors.account_type = ['Tipo di account non valido']
  }
  
  // Personal data validation
  if (data.account_type === 'personal') {
    if (!data.nome?.trim()) {
      errors.nome = ['Nome è obbligatorio']
    }
    if (!data.cognome?.trim()) {
      errors.cognome = ['Cognome è obbligatorio']
    }
  }
  
  // Business data validation
  if (data.account_type === 'business') {
    if (!data.ragione_sociale?.trim()) {
      errors.ragione_sociale = ['Ragione sociale è obbligatoria']
    }
    if (!data.piva?.trim()) {
      errors.piva = ['P.IVA è obbligatoria']
    } else if (!isValidPIVA(data.piva)) {
      errors.piva = ['P.IVA non valida']
    }
  }
  
  // Contact validation
  if (!data.phone?.trim()) {
    errors.phone = ['Telefono è obbligatorio']
  } else if (!isValidPhone(data.phone)) {
    errors.phone = ['Telefono non valido']
  }
  
  if (!data.email?.trim()) {
    errors.email = ['Email è obbligatoria']
  } else if (!isValidEmail(data.email)) {
    errors.email = ['Email non valida']
  }
  
  // Credentials validation
  if (!data.username?.trim()) {
    errors.username = ['Username è obbligatorio']
  } else if (!isValidUsername(data.username)) {
    errors.username = ['Username non valido']
  }
  
  if (!data.password?.trim()) {
    errors.password = ['Password è obbligatoria']
  } else if (!isValidPassword(data.password)) {
    errors.password = ['Password non valida']
  }
  
  if (!data.password_confirmation?.trim()) {
    errors.password_confirmation = ['Conferma password è obbligatoria']
  } else if (data.password !== data.password_confirmation) {
    errors.password_confirmation = ['Le password non coincidono']
  }
  
  // Terms validation
  if (!validateTerms(data)) {
    errors.terms = ['Devi accettare tutti i termini e condizioni']
  }
  
  return errors
}
