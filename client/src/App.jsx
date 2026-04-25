import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AssetsPage from './pages/dashboard/AssetsPage';
import WillPage from './pages/dashboard/WillPage';
import ContactsPage from './pages/dashboard/ContactsPage';
import AuditLogPage from './pages/dashboard/AuditLogPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import MessagesPage from './pages/dashboard/MessagesPage';
import BeneficiaryPortalPage from './pages/beneficiary/BeneficiaryPortalPage';
import EmergencyPage from './pages/emergency/EmergencyPage';

function DashboardRoutes() {
  const { user, logout } = useAuth();

  return (
    <Routes>
      <Route element={<DashboardLayout user={user} onLogout={logout} />}>
        <Route index element={<DashboardPage />} />
        <Route path="assets" element={<AssetsPage />} />
        <Route path="will" element={<WillPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="audit-log" element={<AuditLogPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardRoutes />
              </ProtectedRoute>
            }
          />

          <Route path="/beneficiary/:token" element={<BeneficiaryPortalPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />

          <Route path="*" element={
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <h1 className="text-h1">404</h1>
              <p className="text-body">Page not found.</p>
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
