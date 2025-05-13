import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import theme from './theme';

import MainLayout from './components/layout/MainLayout';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TopicsPage from './pages/TopicsPage';
import TimelinePage from './pages/TimelinePage';
import EmployeeTimelinePage from './pages/EmployeeTimelinePage';
import ReportingEmployeesPage from './pages/ReportingEmployeesPage';
import SignupPage from './pages/SignupPage';

// Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    document.title = 'Learning Tracker';
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
            } />

            <Route path="/signup" element={
              !isAuthenticated ? <SignupPage /> : <Navigate to="/login" replace />
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
        </MainLayout>
      </Router>
    </ChakraProvider>
  );
}

export default App;