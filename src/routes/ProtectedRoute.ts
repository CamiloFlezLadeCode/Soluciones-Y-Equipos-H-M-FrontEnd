import { createElement, type ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '@services/api/auth.service';

interface ProtectedRouteProps {
    children: ReactElement
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const hasValidSession = authService.isAuthenticated();

    if (!hasValidSession) {
        return createElement(Navigate, { to: '/login', replace: true });
    }

    return children;
}
