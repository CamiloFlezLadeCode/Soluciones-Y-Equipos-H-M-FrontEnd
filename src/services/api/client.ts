import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { API_CONFIG } from '@config/api.config'
import type { ApiResponse } from './types'

const AUTH_CHANGED_EVENT = 'auth:session-changed'

class ApiClient {
    private client: AxiosInstance
    private token: string | null = null

    constructor() {
        this.client = axios.create({
            baseURL: API_CONFIG.BASE_URL,
            timeout: API_CONFIG.TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
            }
        })

        this.setupInterceptors()
    }

    private setupInterceptors() {
        // Request interceptor (añade token)
        this.client.interceptors.request.use(
            (config) => {
                const token = this.getToken()
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
                return config
            },
            (error) => Promise.reject(error)
        )

        // Response interceptor (manejo global de errores)
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Token expirado
                    this.clearToken()
                }
                return Promise.reject(error)
            }
        )
    }

    setToken(token: string | null) {
        this.token = token
        localStorage.setItem('auth_token', token || '')
        window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
    }

    getToken(): string | null {
        return this.token || localStorage.getItem('auth_token')
    }

    clearToken() {
        this.token = null
        localStorage.removeItem('auth_token')
        window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
    }

    async request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response: AxiosResponse<ApiResponse<T>> = await this.client.request(config)
            return response.data
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                return error.response.data as ApiResponse<T>
            }
            throw error
        }
    }

    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>({ ...config, method: 'GET', url })
    }

    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>({ ...config, method: 'POST', url, data })
    }

    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>({ ...config, method: 'PUT', url, data })
    }

    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>({ ...config, method: 'DELETE', url })
    }
}

export const apiClient = new ApiClient()
