import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';
import Login from './views/Login';
import Register from './views/Register';
import Dashboard from './views/Dashboard';
import Profile from './views/Profile';
import Settings from './views/Settings';
import Members from './views/Members';
import Activities from './views/Activities';
import Shop from './views/Shop';
import { useApp } from './context/AppContext';

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useApp();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useApp();
  
  if (loading) return null;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#1a1a1a',
            borderRadius: '24px',
            padding: '16px 24px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            fontSize: '12px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          },
          success: {
            iconTheme: {
              primary: '#0ea5e9',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/" 
          element={
            <AuthRoute>
              <Layout />
            </AuthRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route 
            path="members" 
            element={
              <AdminRoute>
                <Members />
              </AdminRoute>
            } 
          />
          <Route path="activities" element={<Activities />} />
          <Route path="shop" element={<Shop />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
