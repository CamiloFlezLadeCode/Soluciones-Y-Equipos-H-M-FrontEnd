import AdminLayout from '@components/layout/AdminLayout';
import { useAuthSession } from '@hooks/useAuthSession';
import DashboardPage from '@pages/DashboardPage';
import LoginPage from '@pages/Login/LoginPage';
import ProtectedRoute from '@routes/ProtectedRoute';
import { Navigate, Route, Routes } from 'react-router-dom';
import ViewUsersPage from '@pages/users/ViewUsersPage';
import ViewEquipmentPage from '@pages/equipment/ViewEquipmentPage';
import SettingsPage from '@pages/settings/SettingsPage';

export default function App() {
  const hasValidSession = useAuthSession();

  return (
    <Routes>
      {/* Públicas */}
      <Route
        path="/login"
        element={hasValidSession ? <Navigate to="/app/panel" replace /> : <LoginPage />}
      />

      {/* Protegidas */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/panel" replace />} />
        <Route path="panel" element={<DashboardPage />} />
        <Route path="usuarios" element={<ViewUsersPage />} />
        <Route path="configuracion" element={<SettingsPage />} />
        <Route path="equipos" element={<ViewEquipmentPage />} />
      </Route>


      <Route path="/panel" element={<Navigate to="/app/panel" replace />} />
      <Route path="/" element={<Navigate to={hasValidSession ? '/app/panel' : '/login'} replace />} />

      {/* Default */}
      <Route
        path="*"
        element={<Navigate to={hasValidSession ? '/app/panel' : '/login'} replace />}
      />
    </Routes>
  );
}
