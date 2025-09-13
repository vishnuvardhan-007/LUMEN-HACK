import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import PaymentPage from './pages/PaymentPage';
import TransactionsPage from './pages/TransactionsPage';
import ServicesPage from './pages/ServicesPage';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user-dashboard" 
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['user']}>
                    <UserDashboard />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/payment" 
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['user']}>
                    <PaymentPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/transactions" 
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['user']}>
                    <TransactionsPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/services" 
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['user']}>
                    <ServicesPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;