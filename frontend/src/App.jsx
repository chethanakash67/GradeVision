import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/common/Sidebar';
import { PageLoader } from './components/common/LoadingSpinner';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Students from './pages/Students';
import Predictions from './pages/Predictions';
import Gamification from './pages/Gamification';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import ForgotPassword from './pages/ForgotPassword';

// Protected Route Wrapper
const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="lg:ml-64 p-4 md:p-8 min-h-screen transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

// Public Route Wrapper (redirect to dashboard if already logged in)
const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

// App Routes
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/students" element={<Students />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/gamification" element={<Gamification />} />
        <Route path="/settings" element={<Profile />} />
      </Route>

      {/* Landing page - accessible to everyone */}
      <Route path="/" element={<LandingPage />} />
      
      {/* 404 - Redirect to landing page for unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component
const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
