'use client'

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('token', token)
}

export const removeToken = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('token')
}

export const initAnonymousAuth = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null
  
  let token = getToken()
  
  if (!token) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/anonymous`, {
        method: 'POST',
      })
      const data = await response.json()
      token = data.token
      setToken(token)
    } catch (error) {
      console.error('Failed to initialize anonymous auth:', error)
      return null
    }
  }
  
  return token
}


