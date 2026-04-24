import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from '@pages/DashboardPage';
import LoginPage from '@pages/Login/LoginPage';
import { authService } from '@services/api/auth.service';
import ProtectedRoute from '@routes/ProtectedRoute';

export default function App() {
  const hasValidSession = authService.isAuthenticated();

  return (
    <Routes>
      <Route
        path="/login"
        element={hasValidSession ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="*"
        element={<Navigate to={hasValidSession ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  );
}
