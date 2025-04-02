"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { BACKEND_URL } from '@/config'

interface User {
  id: string
  name: string
  email: string
  username?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  //validate token
  const validateToken = async (storedToken: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/validate-token`, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      });

      if (!response.ok) {
        throw new Error("Invalid Token")
      }

      return true;
    } catch (error) {
      console.error('Token validation failed: ', error);
      return false;
    }
  }

  useEffect(() => {

    const initializeAuth = async () => {
      // Check if we have a token in localStorage
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        try {
          const isValid = await validateToken(storedToken);
          if(isValid){
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setIsLoading(false)
    }

    initializeAuth();

  }, [])

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    router.push('/signIn')
  }

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}