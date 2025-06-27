import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import ProtectedRoute from "./ProtectedRoute";

const LoginPage = React.lazy(() => import("../../pages/LoginPage"));
const SignupPage = React.lazy(() => import("../../pages/SignupPage"));
const DashboardPage = React.lazy(() => import("../../pages/DashboardPage"));
const TopicsPage = React.lazy(() => import("../../pages/TopicsPage"));
const TimelinePage = React.lazy(() => import("../../pages/TimelinePage"));
const EmployeeTimelinePage = React.lazy(
  () => import("../../pages/EmployeeTimelinePage")
);
const ReportingEmployeesPage = React.lazy(
  () => import("../../pages/ReportingEmployeesPage")
);
const AllEmployeesPage = React.lazy(
  () => import("../../pages/admin/AllEmployeesPage")
);
const VideoUpload = React.lazy(
  () => import("../../components/admin/VideoUpload")
);

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />

      <Route
        path="/signup"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <SignupPage />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/topics"
        element={
          <ProtectedRoute>
            <TopicsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/timeline"
        element={
          <ProtectedRoute>
            <TimelinePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reporting-employees"
        element={
          <ProtectedRoute roles={["manager"]}>
            <ReportingEmployeesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee/:employeeId/timeline"
        element={
          <ProtectedRoute roles={["manager"]}>
            <EmployeeTimelinePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employees"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AllEmployeesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/videos/upload"
        element={
          <ProtectedRoute roles={["admin"]}>
            <VideoUpload />
          </ProtectedRoute>
        }
      />

      {/* Fallback routes */}

      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />

      <Route
        path="*"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
