import { authService } from '@services/api/auth.service'
import { useEffect, useState } from 'react'

const AUTH_CHANGED_EVENT = 'auth:session-changed'

export const useAuthSession = () => {
    const [hasValidSession, setHasValidSession] = useState(() => authService.isAuthenticated())

    useEffect(() => {
        const syncSession = () => {
            setHasValidSession(authService.isAuthenticated())
        }

        window.addEventListener(AUTH_CHANGED_EVENT, syncSession)
        window.addEventListener('storage', syncSession)

        return () => {
            window.removeEventListener(AUTH_CHANGED_EVENT, syncSession)
            window.removeEventListener('storage', syncSession)
        }
    }, [])

    return hasValidSession
}
