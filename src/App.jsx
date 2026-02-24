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
import AdminDashboard from './AdminComponents/Dashboard/AdminDashboard.jsx';
import AdminAppointments from './AdminComponents/Appointments/AdminAppointments.jsx';
import AdminDoctors from './AdminComponents/Doctors/AdminDoctors.jsx';
import AdminPatients from './AdminComponents/Patients/AdminPatients.jsx';
import AdminBilling from './AdminComponents/Billing/AdminBilling.jsx';
import AdminReports from './AdminComponents/Reports/AdminReports.jsx';
import AdminPrescriptions from './AdminComponents/Prescriptions/AdminPrescriptions.jsx';



// protected route
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      return <Navigate to="/login" replace />;
    }

    if (role && role !== userRole) {
      return <Navigate to="/login" replace />;
    }

  } catch (error) {
    return <Navigate to="/login" replace />;
  }

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
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="doctors" element={<AdminDoctors />} />
          <Route path="patients" element={<AdminPatients />} />
          <Route path="billing" element={<AdminBilling />} />
          <Route path="prescriptions" element={<AdminPrescriptions />} />
          <Route path="reports" element={<AdminReports />} />
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