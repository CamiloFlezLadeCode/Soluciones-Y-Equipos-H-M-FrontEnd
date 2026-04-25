import { createElement, type ReactElement } from 'react';
import { useAuthSession } from '@hooks/useAuthSession';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: ReactElement
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const hasValidSession = useAuthSession();

    if (!hasValidSession) {
        return createElement(Navigate, { to: '/login', replace: true });
    }

    return children;
}
