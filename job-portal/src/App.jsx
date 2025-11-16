import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import WorkOppurtunies from "./pages/WorkOppurtunies";
import CreateProfile from "./components/CreateProfile";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Header from "./components/Header";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import JobsPage from "./pages/JobsPage";
import JobView from "./pages/JobView"

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
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<JobsPage/>}/>
        <Route path="/job/:id" element={<JobView/>}/>
        
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/job" element={<WorkOppurtunies />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/profile-complete" element={<CreateProfile />} />
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
