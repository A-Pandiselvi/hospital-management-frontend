import React, { useState } from 'react';
import { Mail, ArrowRight, KeyRound } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    
    // TODO: Add API call to verify email exists and send OTP
    console.log('Sending OTP to:', email);
    
    // Simulate API call
    setTimeout(() => {
      // Save email temporarily
      localStorage.setItem('reset_email', email);
      
      // Redirect to OTP verification
      window.location.href = '/forgot-password-otp';
    }, 1500);
  };

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
            <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
            <p className="text-blue-100">Don't worry, we'll help you reset it</p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {/* Info Banner */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
              <p className="text-sm text-blue-700">
                Enter your registered email address and we'll send you an OTP to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      error ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter your registered email"
                  />
                </div>
                {error && (
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
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
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <ArrowRight className="h-5 w-5" />
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

export default ForgotPassword;