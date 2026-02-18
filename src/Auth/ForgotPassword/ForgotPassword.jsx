import React, { useState } from 'react';
import { Mail, ArrowRight, KeyRound, Hospital, ShieldCheck, ChevronLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
const navigate = useNavigate();
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
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('reset_email', email);
      navigate('/forgot-password-otp');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      {/* Main Container */}
      <div className="max-w-5xl w-full bg-white border border-blue-300 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side: Branding & Security Info */}
        <div className="w-full md:w-1/2 bg-gradient-to-b from-blue-900 to-blue-800 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-cyan-300/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-10">
              <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
                <Hospital className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">MediFlow</span>
            </div>
            
            <h2 className="text-4xl font-extrabold leading-tight mb-6 animate-[fadeIn_0.8s_ease-out]">
              Account <br /> <span className="text-cyan-200">Recovery.</span>
            </h2>
            <p className="text-blue-100 text-lg opacity-90 leading-relaxed">
              Don't worry. It happens to the best of us. Let's get you back into your workspace securely.
            </p>
          </div>

          <div className="relative z-10 mt-auto">
             <div className="bg-black/10 backdrop-blur-sm p-5 rounded-2xl border border-white/10 flex items-start space-x-4">
                <div className="bg-cyan-400/20 p-2 rounded-lg">
                    <ShieldCheck className="h-6 w-6 text-cyan-300" />
                </div>
                <div>
                    <h4 className="font-bold text-sm">Secure Reset</h4>
                    <p className="text-xs text-blue-100 mt-1 opacity-80">We use multi-factor verification to ensure your medical data stays protected during recovery.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-16 bg-blue-50 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h3>
            <p className="text-gray-500 font-medium">Enter your email to receive a reset code</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">
                Registered Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 transition-colors ${error ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'}`} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className={`w-full pl-12 pr-4 py-3 bg-gray-50 border-2 rounded-xl outline-none transition-all duration-200 ${
                    error ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 focus:bg-white'
                  }`}
                  placeholder="name@hospital.com"
                />
              </div>
              {error && (
                <p className="text-xs font-bold text-red-500 ml-1 animate-[fadeIn_0.3s_ease-out]">
                  {error}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-800 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all duration-300 shadow-xl shadow-blue-900/40 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Sending Request...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-50 text-center">
            <a 
              href="/login" 
              className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-blue-700 transition-colors group"
            >
              <ChevronLeft className="h-4 w-4 mr-1 transform group-hover:-translate-x-1 transition-transform" />
              Return to Login
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

export default ForgotPassword;