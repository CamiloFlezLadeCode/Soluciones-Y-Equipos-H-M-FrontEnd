// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { authService } from '@services/api/auth.service'
import type { LoginRequest, User } from '@services/api/types'

interface AuthContextType {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (credentials: LoginRequest) => Promise<User>
    logout: () => void
    checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Verificar autenticación al cargar la app
    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        setIsLoading(true)
        try {
            // Intentar obtener usuario del token actual
            const currentUser = await authService.getCurrentUser()
            setUser(currentUser)
        } catch (error) {
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    const login = async (credentials: LoginRequest): Promise<User> => {
        const userData = await authService.login(credentials)
        setUser(userData)
        return userData
    }

    const logout = () => {
        authService.logout()
        setUser(null)
    }

    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        checkAuth,
    }

    return <AuthContext.Provider value={ value }> { children } </AuthContext.Provider>
}

// Hook personalizado para usar el contexto
export const useAuth = (): AuthContextType => {
    const context = React.useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}