import React, { useState, useRef, useEffect } from 'react';
import { Shield, Mail, CheckCircle, RefreshCw } from 'lucide-react';

const ForgotPasswordOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef([]);
  const email = localStorage.getItem('reset_email');

  // Timer countdown
  useEffect(() => {
    let interval;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      window.location.href = '/forgot-password';
    }
  }, [email]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
    
    const nextIndex = Math.min(newOtp.length, 5);
    inputRefs.current[nextIndex].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsVerifying(true);
    
    // TODO: Add OTP verification API call
    console.log('Verifying OTP:', otpString, 'for email:', email);
    
    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      
      // Save OTP verification status
      localStorage.setItem('reset_otp_verified', 'true');
      
      // Redirect to reset password page
      window.location.href = '/reset-password';
    }, 1500);
  };

  const handleResend = async () => {
    console.log('Resending OTP to:', email);
    
    // TODO: Add actual API call to backend
    // await fetch('/api/auth/forgot-password', { 
    //   method: 'POST', 
    //   body: JSON.stringify({ email }) 
    // })
    
    alert('✅ New OTP has been sent to your email!');
    
    setTimer(60);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0].focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full p-4 mb-4">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Verify OTP</h1>
            <p className="text-blue-100">Enter the code sent to your email</p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {/* Info Message */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg flex items-start">
              <Mail className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-700">
                  We've sent a 6-digit code to <strong>{email}</strong>
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* OTP Input Boxes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
                  Enter 6-Digit OTP
                </label>
                <div className="flex justify-center space-x-2 sm:space-x-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(ref) => (inputRefs.current[index] = ref)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        error ? 'border-red-500' : 'border-gray-200'
                      } ${digit ? 'border-blue-500 bg-blue-50' : ''}`}
                    />
                  ))}
                </div>
                {error && (
                  <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
                )}
              </div>

              {/* Timer and Resend */}
              <div className="text-center">
                {!canResend ? (
                  <p className="text-sm text-gray-600">
                    Resend OTP in{' '}
                    <span className="font-semibold text-blue-600">{timer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-sm text-blue-600 hover:text-blue-500 font-semibold flex items-center justify-center space-x-1 mx-auto transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Resend OTP</span>
                  </button>
                )}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isVerifying}
                className={`w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center space-x-2 ${
                  isVerifying ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isVerifying ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Verify OTP</span>
                  </>
                )}
              </button>
            </form>

            {/* Back Link */}
            <div className="mt-6 text-center">
              <a 
                href="/forgot-password" 
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Change Email
              </a>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 bg-white/50 backdrop-blur-sm rounded-lg p-4">
          <p className="text-xs text-gray-600 text-center">
            🔒 For your security, the OTP will expire in 10 minutes.
          </p>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-sm mt-4">
          © 2026 Hospital Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordOTP;