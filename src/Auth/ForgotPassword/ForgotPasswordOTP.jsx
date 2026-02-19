import React, { useState, useRef, useEffect } from 'react';
import { Shield, Mail, CheckCircle, RefreshCw, Hospital, ChevronLeft, Lock } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../Axios/AxiosInstance';
import ToastMsg from '../../Toast/ToastMsg';

const ForgotPasswordOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const email = localStorage.getItem('reset_email');
const otpString = otp.join('');
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
useEffect(() => {
  if (inputRefs.current[0]) {
    inputRefs.current[0].focus();
  }
}, []);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
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

  const otpString = otp.join("");

  if (otpString.length !== 6) {
    setError("Please enter all 6 digits");
    ToastMsg("warning", "Enter complete OTP");
    return;
  }

  try {
    setIsVerifying(true);
const response = await axiosInstance.post("/auth/verify-reset-otp", {
  email,
  otp: otpString
});

    ToastMsg("success", response.data.message || "OTP verified");

    localStorage.setItem("reset_otp_verified", "true");

    navigate("/reset-password");

  } catch (error) {
    const message =
      error.response?.data?.message || "Invalid or expired OTP";
    ToastMsg("error", message);
  } finally {
    setIsVerifying(false);
  }
};

const handleResend = async () => {
  try {
    setIsVerifying(true);

    const response = await axiosInstance.post("auth/resend-reset-otp", {
      email,
    });

    ToastMsg("success", response.data.message || "OTP resent successfully");

    // reset timer
    setTimer(60);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);

    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to resend OTP";
    ToastMsg("error", message);
  } finally {
    setIsVerifying(false);
  }
};


  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-white border border-blue-300 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side: Branding & Visuals */}
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
              Verify your <br /> <span className="text-cyan-200">Identity.</span>
            </h2>
            <p className="text-blue-100 text-lg opacity-90 leading-relaxed max-w-sm">
              We've sent a one-time code to verify your request. This ensures your medical profile remains secure.
            </p>
          </div>

          <div className="relative z-10 mt-auto">
             <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center space-x-4 animate-bounce [animation-duration:4s]">
                <Shield className="h-6 w-6 text-cyan-300" />
                <p className="text-xs font-medium">Identity Verification Active</p>
             </div>
          </div>
        </div>

        {/* Right Side: OTP Input */}
        <div className="w-full md:w-1/2 p-8 md:p-16 bg-blue-50 flex flex-col justify-center">
          <div className="mb-8 text-center md:text-left">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Check your email</h3>
            <p className="text-gray-500 font-medium">
              Code sent to <span className="text-blue-600 font-bold">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between gap-2 sm:gap-3">
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
                  className={`w-full aspect-square text-center text-2xl font-black border-2 rounded-xl outline-none transition-all duration-200 ${
                    error ? 'border-red-500 bg-red-50' : 
                    digit ? 'border-blue-500 bg-blue-50 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 
                    'border-gray-300 bg-gray-50 focus:border-blue-400 focus:bg-white'
                  }`}
                />
              ))}
            </div>

            {error && (
              <p className="text-sm font-bold text-red-500 text-center bg-red-50 py-3 rounded-xl animate-shake">
                {error}
              </p>
            )}

            <div className="space-y-4">
             <button
  type="submit"
  disabled={
    isVerifying ||
    otpString.length !== 6 ||
    canResend
  }
  className={`w-full py-3 rounded-xl font-bold transition-all duration-300 shadow-xl flex items-center justify-center space-x-2
    ${
      isVerifying || otpString.length !== 6 || canResend
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-blue-800 text-white hover:bg-blue-700 shadow-blue-900/40"
    }
  `}
>

                {isVerifying ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    <span>Verify Code</span>
                  </>
                )}
              </button>

              <div className="text-center">
                {!canResend ? (
                  <div className="inline-flex items-center space-x-2 text-sm font-bold text-gray-700 uppercase tracking-wider">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span>Resend in {timer}s</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-blue-600 font-bold hover:text-cyan-700 transition-colors flex items-center justify-center space-x-2 mx-auto"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Request New Code</span>
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-50 text-center">
            <a href="/forgot-password" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Change Email
            </a>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      ` }} />
    </div>
  );
};

export default ForgotPasswordOTP;