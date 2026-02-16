import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, KeyRound } from 'lucide-react';

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

  const email = localStorage.getItem('reset_email');
  const otpVerified = localStorage.getItem('reset_otp_verified');

  // Redirect if not verified
  useEffect(() => {
    if (!email || otpVerified !== 'true') {
      window.location.href = '/forgot-password';
    }
  }, [email, otpVerified]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    // Validate new password
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else {
      const passwordError = validatePassword(formData.newPassword);
      if (passwordError) {
        newErrors.newPassword = passwordError;
      }
    }
    
    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    // TODO: Add API call to reset password
    console.log('Resetting password for:', email);
    console.log('New password:', formData.newPassword);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      // Clear localStorage
      localStorage.removeItem('reset_email');
      localStorage.removeItem('reset_otp_verified');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md w-full">
          <div className="inline-block bg-green-100 rounded-full p-6 mb-6 animate-bounce">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Reset Successful!</h2>
          <p className="text-gray-600 mb-4">
            Your password has been changed successfully.
          </p>
          <div className="animate-pulse text-blue-600">
            Redirecting to login...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full p-4 mb-4">
              <KeyRound className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-blue-100">Create your new password</p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {/* Info Banner */}
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg">
              <p className="text-sm text-green-700">
                <strong>✓ Email Verified:</strong> {email}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.newPassword ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword.new ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 6 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword.confirm ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Password Requirements:</p>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li className="flex items-center">
                    <span className={`mr-2 ${formData.newPassword.length >= 6 ? 'text-green-600' : 'text-gray-400'}`}>
                      {formData.newPassword.length >= 6 ? '✓' : '○'}
                    </span>
                    At least 6 characters
                  </li>
                  <li className="flex items-center">
                    <span className={`mr-2 ${formData.newPassword && formData.confirmPassword && formData.newPassword === formData.confirmPassword ? 'text-green-600' : 'text-gray-400'}`}>
                      {formData.newPassword && formData.confirmPassword && formData.newPassword === formData.confirmPassword ? '✓' : '○'}
                    </span>
                    Passwords match
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center space-x-2 ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Reset Password</span>
                  </>
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <a 
                href="/login" 
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to Login
              </a>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © 2026 Hospital Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;