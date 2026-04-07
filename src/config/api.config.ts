import { URLS } from '@constants/urls';

export const API_CONFIG = {
    BASE_URL: URLS.API_BASE_URL,
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    ENDPOINTS: {
        AUTH: {
            LOGIN: 'auth/login',
        },
        USERS: {
            BASE: 'users'
        }
    }
} as const