import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Layout from './components/Layout';

// Pages (to be implemented)
import Landing from './pages/Landing';
import BrowseRoutes from './pages/BrowseRoutes';
import PostRoute from './pages/PostRoute';
import RouteDetail from './pages/RouteDetail';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import SchoolPool from './pages/SchoolPool';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user, profile, loading, isAdmin } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
    </div>
  );

  if (!user) return <Navigate to="/profile" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/browse" element={<BrowseRoutes />} />
            <Route path="/post" element={<ProtectedRoute><PostRoute /></ProtectedRoute>} />
            <Route path="/school-pool" element={<SchoolPool />} />
            <Route path="/route/:id" element={<RouteDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
