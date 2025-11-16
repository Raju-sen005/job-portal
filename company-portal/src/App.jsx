import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MyJob from "./pages/MyJob";
import CompanyProfile from "./pages/CompanyProfile";
import CreateJob from "./pages/CreateJob";
import Application from "./pages/Application";
import Register from "./pages/Register";
import Login from "./pages/Login";
import JobView from "./pages/JobVeiw";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import EditJobPage from "./pages/EditJobPage";
import TotalCandidate from "./pages/TotalCandidate";
import NewCandidate from "./pages/NewCandidate";
import NewJob from "./pages/NewJob";

// Protected Route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/register" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/job/:id" element={<JobView />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-job/:jobId" element={<EditJobPage />} />
        <Route path="/total-candidate" element={<TotalCandidate />} />
        <Route path="/new-candidate" element={<NewCandidate />} />
        <Route path="/new-job" element={<NewJob/>}/>
        
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-jobs"
          element={
            <ProtectedRoute>
              <MyJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company-profile"
          element={
            <ProtectedRoute>
              <CompanyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-job"
          element={
            <ProtectedRoute>
              <CreateJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/application"
          element={
            <ProtectedRoute>
              <Application />
            </ProtectedRoute>
          }
        />

        {/* Default Route: Redirect / to /register */}
        <Route path="/" element={<Navigate to="/register" replace />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
