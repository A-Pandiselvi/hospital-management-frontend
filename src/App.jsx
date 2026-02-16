import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './Auth/Login/Login.jsx'
import Register from './Auth/Register/Register.jsx'
import OTP from './Auth/OTP/OTP.jsx'
import ForgotPassword from './Auth/ForgotPassword/ForgotPassword.jsx'
import ForgotPasswordOTP from './Auth/ForgotPassword/ForgotPasswordOTP.jsx'
import ResetPassword from './Auth/ForgotPassword/ResetPassword.jsx'
import Layout from './Layout/Layout.jsx';
import PatientDashboard from './PatientComponents/PatientDashboard.jsx';
import DoctorDashboard from './DoctorComponents/DoctorDashboard.jsx';
import AdminDashboard from './AdminComponents/AdminDashboard.jsx';



// protected route
const ProtectedRoute = ({ children, role }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userRole = localStorage.getItem("role");

  if (!isLoggedIn) return <Navigate to="/login" />;
  if (role && role !== userRole) return <Navigate to="/login" />;

  return children;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* Auth */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<OTP />} />
        
        {/* Forgot Password Flow */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password-otp" element={<ForgotPasswordOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ADMIN */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <Layout role="admin" />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

        {/* DOCTOR */}
        <Route path="/doctor" element={
          <ProtectedRoute role="doctor">
            <Layout role="doctor" />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<DoctorDashboard />} />
        </Route>

        {/* PATIENT */}
        <Route path="/patient" element={
          <ProtectedRoute role="patient">
            <Layout role="patient" />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<PatientDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </Router>
  );
}

export default App;