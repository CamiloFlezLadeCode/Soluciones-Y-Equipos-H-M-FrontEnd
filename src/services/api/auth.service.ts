import { authApi } from '@services/api/endpoints'
import { apiClient } from '@services/api/client'
import type { LoginRequest, LoginResponse } from '@services/api/types'

class AuthService {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await authApi.login(credentials)

        if (response.status === 'Success' && response.data) {
            // Guardar token en el cliente
            apiClient.setToken(response.data ?? null)

            // Guardar usuario en localStorage (opcional)
            localStorage.setItem('user', JSON.stringify(response.data))

            return response.data
        }

        throw new Error(response.message)
    }

    logout(): void {
        apiClient.clearToken()
        localStorage.removeItem('user')
        window.location.href = '/login'
    }

    getToken(): string | null {
        return apiClient.getToken()
    }

    isAuthenticated(): boolean {
        const token = this.getToken()
        if (!token) return false

        // Verificar expiración
        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            return payload.exp > Date.now() / 1000
        } catch {
            return false
        }
    }
}

export const authService = new AuthService()