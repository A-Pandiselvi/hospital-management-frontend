import React, { useState, useRef, useEffect } from 'react';
import { Shield, Mail, CheckCircle, RefreshCw, ArrowLeft, Hospital } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef([]);
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

  setTimeout(() => {
    const email = localStorage.getItem("pending_email");

    localStorage.setItem("email_verified", "true");
    localStorage.setItem("verified_email", email);

    setIsVerifying(false);

    navigate("/register");   // 👈 directly go to register
  }, 1500);
};


const handleResend = () => {
  setTimer(60);
  setCanResend(false);
  setOtp(['', '', '', '', '', '']);
  setError('');
  setIsVerified(false);
  setIsVerifying(false);

  // Focus first box after reset
  setTimeout(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, 0);
};



  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-white border border-blue-300 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side: Branding (Animated) */}
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
              Security is our <br /> <span className="text-cyan-200">Priority.</span>
            </h2>
            <p className="text-blue-100 text-lg opacity-90 leading-relaxed">
              We've sent a secure 6-digit code to protect your medical credentials and patient data.
            </p>
          </div>

          <div className="relative z-10 mt-auto">
             <div className="bg-black/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 flex items-center space-x-3">
                <Shield className="h-5 w-5 text-cyan-300" />
                <span className="text-sm font-medium">End-to-end encrypted verification</span>
             </div>
          </div>
        </div>

        {/* Right Side: OTP Content */}
        <div className="w-full md:w-1/2 p-8 md:p-16 bg-blue-50 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Verify Account</h3>
            <p className="text-gray-500 font-medium">Enter the code sent to your inbox</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between gap-2 sm:gap-4">
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
                    digit ? 'border-blue-500 bg-blue-50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 
                    'border-gray-300 bg-gray-50 focus:border-blue-400 focus:bg-white'
                  }`}
                />
              ))}
            </div>

            {error && (
              <p className="text-sm font-bold text-red-500 text-center bg-red-50 py-2 rounded-lg">
                ⚠️ {error}
              </p>
            )}

            <div className="flex flex-col space-y-4">
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
      <Shield className="h-5 w-5" />
      <span>Verify Now</span>
    </>
  )}
</button>


              <div className="text-center pt-2">
                {!canResend ? (
                  <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Resend in <span className="text-blue-600">{timer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="group text-blue-600 font-bold flex items-center justify-center space-x-2 mx-auto hover:text-cyan-600 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                    <span>Send New Code</span>
                  </button>
                )}
              </div>
            </div>
          </form>

        <button
  type="button"
  onClick={() => {
    localStorage.removeItem("email_verified");
    localStorage.removeItem("verified_email");
    navigate("/register");
  }}
  className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors"
>
  <ArrowLeft className="h-4 w-4 mr-2" />
  Back to Registration
</button>

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

export default OTP;