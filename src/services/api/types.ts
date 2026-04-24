export interface ApiResponse<T = any> {
    status: 'Success' | 'Error'
    code: number
    message: string
    data: T | null
}

export interface LoginRequest {
    credenDocumentoUsuario: string
    credenClave: string
}

// export interface LoginResponse {
//     token: string | null
//     usuario: {
//         usuId: number
//         usuDocumento: string
//         usuNombres: string
//         usuApellidos: string
//         usuCorreo: string
//     }
// }

export type LoginResponse = string | null

export interface ErrorResponse {
    status: 'error'
    code: number
    message: string
}

export type User = {
    usuId: number
    usuDocumento: string
    usuNombres: string
    usuApellidos: string
    usuCorreo: string
}