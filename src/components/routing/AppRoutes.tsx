import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import ProtectedRoute from './ProtectedRoute';

// Lazy loaded pages
const LoginPage = React.lazy(() => import('../../pages/LoginPage'));
const SignupPage = React.lazy(() => import('../../pages/SignupPage'));
const DashboardPage = React.lazy(() => import('../../pages/DashboardPage'));
const TopicsPage = React.lazy(() => import('../../pages/TopicsPage'));
const TimelinePage = React.lazy(() => import('../../pages/TimelinePage'));
const EmployeeTimelinePage = React.lazy(() => import('../../pages/EmployeeTimelinePage'));
const ReportingEmployeesPage = React.lazy(() => import('../../pages/ReportingEmployeesPage'));
// const AssignTopicsPage = React.lazy(() => import('../../pages/AssignTopicsPage'));
// const AllEmployeesPage = React.lazy(() => import('../../pages/admin/AllEmployeesPage'));

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
      } />
      
      <Route path="/signup" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage />
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      
      <Route path="/topics" element={
        <ProtectedRoute>
          <TopicsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/timeline" element={
        <ProtectedRoute>
          <TimelinePage />
        </ProtectedRoute>
      } />

      <Route path="/reporting-employees" element={
        <ProtectedRoute roles={['manager']}>
          <ReportingEmployeesPage />
        </ProtectedRoute>
      } />

      <Route path="/employee/:employeeId/timeline" element={
        <ProtectedRoute roles={['manager']}>
          <EmployeeTimelinePage />
        </ProtectedRoute>
      } />
      
      {/* Fallback routes */}
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
};

export default AppRoutes;