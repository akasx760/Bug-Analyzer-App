import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ViewBugs from "./components/ViewBugs";
import ViewBugDetails from "./components/ViewBugDetails";
import AddBug from "./components/AddBug";
import UpdateBug from "./components/UpdateBug";
import Login from "./components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer";
import Profile from "./components/Profile";
import DeveloperDashboard from "./components/DeveloperDashboard";
import TesterDashboard from "./components/TesterDashboard";
import "./App.css";
import Notification from "./components/Notification";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

// Dashboard Redirect Component
const DashboardRedirect = () => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Redirect based on user role
  switch (currentUser.role) {
    case "DEVELOPER":
      return <Navigate to="/developer-dashboard" />;
    case "TESTER":
      return <Navigate to="/tester-dashboard" />;
    default:
      // For users without specific role (USER), show the Home dashboard
      return <Home />;
  }
};

function AppContent() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Home route - shows different content based on role */}
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          } />
          
          {/* Home page (for users without specific role) */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          
          <Route path="/view" element={
            <ProtectedRoute>
              <ViewBugs />
            </ProtectedRoute>
          } />

<Route path="/notifications" element={<Notification />} />
          
          <Route path="/view/:id" element={
            <ProtectedRoute>
              <ViewBugDetails />
            </ProtectedRoute>
          } />
          
          <Route path="/add" element={
            <ProtectedRoute>
              <AddBug />
            </ProtectedRoute>
          } />
          
          <Route path="/update/:id" element={
            <ProtectedRoute>
              <UpdateBug />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Role-specific dashboards */}
          <Route path="/developer-dashboard" element={
            <ProtectedRoute>
              <DeveloperDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/tester-dashboard" element={
            <ProtectedRoute>
              <TesterDashboard />
            </ProtectedRoute>
          } />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;