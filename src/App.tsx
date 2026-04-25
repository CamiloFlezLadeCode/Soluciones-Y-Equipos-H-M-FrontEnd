import AdminLayout from '@components/layout/AdminLayout';
import { useAuthSession } from '@hooks/useAuthSession';
import DashboardPage from '@pages/DashboardPage';
import LoginPage from '@pages/Login/LoginPage';
import ProtectedRoute from '@routes/ProtectedRoute';
import { Navigate, Route, Routes } from 'react-router-dom';
import ViewUsersPage from '@pages/users/viewUsersPage';

export default function App() {
  const hasValidSession = useAuthSession();

  return (
    <Routes>
      <Route
        path="/login"
        element={hasValidSession ? <Navigate to="/app/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<ViewUsersPage />} />
        <Route path="settings" element={<DashboardPage />} />
      </Route>
      <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/" element={<Navigate to={hasValidSession ? '/app/dashboard' : '/login'} replace />} />
      <Route
        path="*"
        element={<Navigate to={hasValidSession ? '/app/dashboard' : '/login'} replace />}
      />
    </Routes>
  );
}
