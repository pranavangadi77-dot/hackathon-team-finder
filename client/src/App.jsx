import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DiscoverTeamsPage from './pages/DiscoverTeamsPage';
import FindMembersPage from './pages/FindMembersPage';
import RecommendationsPage from './pages/RecommendationsPage';
import CreateTeamPage from './pages/CreateTeamPage';
import MyTeamsPage from './pages/MyTeamsPage';
import JoinRequestsPage from './pages/JoinRequestsPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0B0F19',
              color: '#F8FAFC',
              border: '1px solid #1E293B',
              borderRadius: '16px',
              fontSize: '12px',
              padding: '12px 16px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 20px 0 rgba(139, 92, 246, 0.1)',
            },
          }}
        />

        <Routes>
          {/* Public Landing & Auth */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* App Layout (Nav + Sidebar) */}
          <Route element={<DashboardLayout />}>
            {/* Publicly browsable with enhanced features when authenticated */}
            <Route path="/teams" element={<DiscoverTeamsPage />} />
            <Route path="/members" element={<FindMembersPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recommendations"
              element={
                <ProtectedRoute>
                  <RecommendationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-team"
              element={
                <ProtectedRoute>
                  <CreateTeamPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-teams"
              element={
                <ProtectedRoute>
                  <MyTeamsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/requests"
              element={
                <ProtectedRoute>
                  <JoinRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
