import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, KeyRound, Hospital, ChevronLeft, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../Axios/AxiosInstance';
import ToastMsg from '../../Toast/ToastMsg';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
const navigate = useNavigate();
  const email = localStorage.getItem('reset_email');
  const otpVerified = localStorage.getItem('reset_otp_verified');

useEffect(() => {
  const storedEmail = localStorage.getItem('reset_email');
  const storedOtp = localStorage.getItem('reset_otp_verified');

  if (!storedEmail || storedOtp !== 'true') {
    navigate('/forgot-password', { replace: true });
  }
}, [navigate]);



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = {};

  if (!formData.newPassword) {
    newErrors.newPassword = "New password is required";
  } else if (formData.newPassword.length < 6) {
    newErrors.newPassword = "Password must be at least 6 characters";
  }

  if (formData.newPassword !== formData.confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    ToastMsg("warning", "Please fix form errors");
    return;
  }

  try {
    setIsLoading(true);

const otp = localStorage.getItem("reset_otp_value");

const response = await axiosInstance.post("/auth/reset-password", {
  email,
  otp,
  newPassword: formData.newPassword,
});


    ToastMsg("success", response.data.message || "Password updated successfully");
localStorage.removeItem("reset_email");
localStorage.removeItem("reset_otp_verified");
localStorage.removeItem("reset_otp_value");

    navigate("/login");

  } catch (error) {
    const message =
      error.response?.data?.message || "Reset failed";
    ToastMsg("error", message);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-white border border-blue-300 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side: Security Branding */}
        <div className="w-full md:w-1/2 bg-gradient-to-b from-blue-900 to-blue-800 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-10">
              <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
                <Hospital className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">MediFlow</span>
            </div>
            
            <h2 className="text-4xl font-extrabold leading-tight mb-6 animate-[fadeIn_0.8s_ease-out]">
              Secure your <br /> <span className="text-cyan-200">Workspace.</span>
            </h2>
            <p className="text-blue-100 text-lg opacity-90 leading-relaxed max-w-sm">
              Choose a strong password to ensure your patient records and administrative tools remain confidential.
            </p>
          </div>

          <div className="relative z-10 mt-auto">
             <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center space-x-4">
                <ShieldCheck className="h-6 w-6 text-cyan-300" />
                <p className="text-xs font-medium uppercase tracking-wider">Advanced Encryption Protocol</p>
             </div>
          </div>
        </div>

        {/* Right Side: Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-16 bg-blue-50 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Set New Password</h3>
            <div className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified: {email}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div className="space-y-2">
              <label className="ext-sm font-bold text-gray-700 uppercase tracking-wider ml-1">New Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 bg-gray-50 border-2 rounded-xl outline-none transition-all ${
                    errors.newPassword ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 focus:bg-white'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600"
                >
                  {showPassword.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.newPassword && <p className="text-xs font-bold text-red-500 ml-1">{errors.newPassword}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="ext-sm font-bold text-gray-700 uppercase tracking-wider ml-1">Confirm New Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 bg-gray-50 border-2 rounded-xl outline-none transition-all ${
                    errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 focus:bg-white'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600"
                >
                  {showPassword.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs font-bold text-red-500 ml-1">{errors.confirmPassword}</p>}
            </div>

            {/* Password Checklist Card */}
            <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold text-gray-600 uppercase">Strength Checklist</p>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center text-xs font-medium">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center mr-2 ${formData.newPassword.length >= 6 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {formData.newPassword.length >= 6 ? '✓' : ''}
                  </div>
                  <span className={formData.newPassword.length >= 6 ? 'text-gray-900' : 'text-gray-400'}>Minimum 6 characters</span>
                </div>
                <div className="flex items-center text-xs font-medium">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center mr-2 ${formData.newPassword && formData.newPassword === formData.confirmPassword ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {formData.newPassword && formData.newPassword === formData.confirmPassword ? '✓' : ''}
                  </div>
                  <span className={formData.newPassword && formData.newPassword === formData.confirmPassword ? 'text-gray-900' : 'text-gray-400'}>Passwords match</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-800 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all duration-300 shadow-xl shadow-blue-900/40 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <KeyRound className="h-5 w-5" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-gray-50 text-center">
            <a href="/login" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Sign In
            </a>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      ` }} />
    </div>
  );
};

export default ResetPassword;