import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './components/layout/MainLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Locations from './pages/Locations';
import Schedule from './pages/Schedule';
import ScanMerchForm from './pages/ScanMerchForm';
import AIReview from './pages/AIReview';
import AuditHistory from './pages/AuditHistory';
import AuditDetail from './pages/AuditDetail';
import StoreInsights from './pages/StoreInsights';
import Profile from './pages/Profile';
import StoreDetail from './pages/StoreDetail';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="locations" element={<ProtectedRoute allowedRoles={['MERCHANDISER', 'RETAIL_OPS_HEAD']}><Locations /></ProtectedRoute>} />
          <Route path="locations/:id" element={<ProtectedRoute allowedRoles={['MERCHANDISER', 'RETAIL_OPS_HEAD']}><StoreDetail /></ProtectedRoute>} />
          <Route path="schedule" element={<ProtectedRoute allowedRoles={['MERCHANDISER', 'RETAIL_OPS_HEAD']}><Schedule /></ProtectedRoute>} />
          <Route path="scan" element={
            <ProtectedRoute allowedRoles={['MERCHANDISER']}>
              <ScanMerchForm />
            </ProtectedRoute>
          } />
          <Route path="scan/review" element={
            <ProtectedRoute allowedRoles={['MERCHANDISER']}>
              <AIReview />
            </ProtectedRoute>
          } />
          <Route path="audits" element={<AuditHistory />} />
          <Route path="audits/:id" element={<AuditDetail />} />
          <Route path="insights" element={<StoreInsights />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
