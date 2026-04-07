// src/services/api/endpoints.ts
import { API_CONFIG } from '@config/api.config'
import { apiClient } from './client'
import type { LoginRequest, LoginResponse, ApiResponse } from './types'

// ✅ Opción 1: Exportar funciones directamente (Recomendado)
export const authApi = {
    login: (data: LoginRequest): Promise<ApiResponse<LoginResponse>> =>
        apiClient.post<LoginResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, data),

    // logout: (): Promise<ApiResponse<void>> =>
    //     apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT),

    // refreshToken: (): Promise<ApiResponse<{ token: string }>> =>
    //     apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH),

    // getCurrentUser: (): Promise<ApiResponse<LoginResponse['usuario']>> =>
    //     apiClient.get(API_CONFIG.ENDPOINTS.AUTH.ME),
}

// export const usersApi = {
//     getAll: (params?: any) =>
//         apiClient.get(API_CONFIG.ENDPOINTS.USERS.GET_ALL, { params }),

//     getOne: (id: number | string) =>
//         apiClient.get(API_CONFIG.ENDPOINTS.USERS.GET_ONE.replace(':id', id.toString())),

//     create: (data: any) =>
//         apiClient.post(API_CONFIG.ENDPOINTS.USERS.CREATE, data),

//     update: (id: number | string, data: any) =>
//         apiClient.put(API_CONFIG.ENDPOINTS.USERS.UPDATE.replace(':id', id.toString()), data),

//     delete: (id: number | string) =>
//         apiClient.delete(API_CONFIG.ENDPOINTS.USERS.DELETE.replace(':id', id.toString())),
// }

// // ✅ Opción 2: Objeto unificado (alternativa)
// export const api = {
//     auth: authApi,
//     users: usersApi,
//     products: {
//         getAll: () => apiClient.get(API_CONFIG.ENDPOINTS.PRODUCTS.GET_ALL),
//         getOne: (id: number) => apiClient.get(API_CONFIG.ENDPOINTS.PRODUCTS.GET_ONE.replace(':id', id.toString())),
//         create: (data: any) => apiClient.post(API_CONFIG.ENDPOINTS.PRODUCTS.CREATE, data),
//     }
// }