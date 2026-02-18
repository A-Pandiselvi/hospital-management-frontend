import React, { useState, useEffect } from 'react';
import { User, Mail, UserPlus, CheckCircle, Lock, ShieldCheck, Hospital, ArrowRight ,EyeOff,Eye} from 'lucide-react';
import { useNavigate } from "react-router-dom";
const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
  password: false,
  confirmPassword: false
});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem("email_verified");
    const email = localStorage.getItem("verified_email");

    if (verified === "true" && email) {
      setIsVerified(true);
      setFormData(prev => ({ ...prev, email }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleVerifyEmail = () => {
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ email: "Please enter a valid business email" });
      return;
    }
    localStorage.setItem("pending_email", formData.email);
    navigate("/verify-otp");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isVerified) {
      alert("Please verify your email first");
      return;
    }

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be 6+ chars';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Account Created:", formData);
    localStorage.removeItem("email_verified");
    localStorage.removeItem("verified_email");
    localStorage.removeItem("pending_email");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:row min-h-[600px] md:flex-row border border-blue-300">
        
        {/* Left Side: Branding */}
        <div className="w-full md:w-1/2 bg-gradient-to-b from-blue-900 to-blue-800 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-10">
              <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
                <Hospital className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">MediFlow</span>
            </div>
            
            <h2 className="text-4xl font-extrabold leading-tight mb-6">
              Join the future of <br /> <span className="text-cyan-200">Health Management.</span>
            </h2>
            <p className="text-blue-100 text-lg opacity-90">
              Create your professional account to start managing departments, staff, and patient flows efficiently.
            </p>
          </div>

          <div className="relative z-10 mt-auto">
             <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3 text-sm font-medium bg-white/10 p-3 rounded-xl border border-white/10">
                    <ShieldCheck className="h-5 w-5 text-cyan-300" />
                    <span>HIPAA Compliant Data Security</span>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-blue-50 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h3>
           <p className="text-gray-500 font-medium">
  {isVerified ? 'Step 3: Complete Profile' : 'Step 1: Email Verification'}
</p>

          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Section */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${isVerified ? 'text-green-500' : 'text-gray-400'}`} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  readOnly={isVerified}
                  className={`w-full pl-12 pr-4 py-3 bg-gray-50 border-2 rounded-xl outline-none transition-all ${
                    isVerified ? 'border-green-500 bg-green-50/30' : 'border-gray-300 focus:border-blue-500 focus:bg-white'
                  }`}
                  placeholder="doctor@hospital.com"
                />
                {isVerified && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.email && <p className="text-xs font-bold text-red-500 ml-1">{errors.email}</p>}
              
              {!isVerified && (
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  className="w-full mt-2 bg-blue-800 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all duration-300 shadow-xl shadow-blue-900/40"
                >
                  Send Verification Code
                </button>
              )}
            </div>

            {/* Locked Fields - Only show when verified */}
            {isVerified && (
              <div className="space-y-5 animate-[fadeIn_0.5s_ease-out]">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Dr. John Doe"
                      onChange={handleChange}
                      className="w-full pl-12 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">Password</label>
                   <div className="relative group">
  <input
    type={showPassword.password ? "text" : "password"}
    name="password"
    placeholder="••••••••"
    onChange={handleChange}
    className="w-full px-4 pr-12 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all"
  />
  <button
    type="button"
    onClick={() =>
      setShowPassword(prev => ({
        ...prev,
        password: !prev.password
      }))
    }
    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600"
  >
    {showPassword.password ? (
      <EyeOff className="h-5 w-5" />
    ) : (
      <Eye className="h-5 w-5" />
    )}
  </button>
</div>

                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">Confirm</label>
                   <div className="relative group">
  <input
    type={showPassword.confirmPassword ? "text" : "password"}
    name="confirmPassword"
    placeholder="••••••••"
    onChange={handleChange}
    className="w-full px-4 pr-12 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all"
  />
  <button
    type="button"
    onClick={() =>
      setShowPassword(prev => ({
        ...prev,
        confirmPassword: !prev.confirmPassword
      }))
    }
    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600"
  >
    {showPassword.confirmPassword ? (
      <EyeOff className="h-5 w-5" />
    ) : (
      <Eye className="h-5 w-5" />
    )}
  </button>
</div>

                  </div>
                </div>

                <div className="flex items-center space-x-2 px-1">
                  <input type="checkbox" id="terms" required className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <label htmlFor="terms" className="text-xs text-gray-500">
                    I agree to the <span className="text-blue-600 font-bold">Service Terms</span>
                  </label>
                </div>

                <button
                  type="submit"
              className="w-full bg-blue-800 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all duration-300 shadow-xl shadow-blue-900/40 flex items-center justify-center space-x-2 mt-4"
 >
                  <UserPlus className="h-5 w-5" />
                  <span>Complete Registration</span>
                </button>
              </div>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-sm text-gray-500">
              Already a member?{' '}
              <a href="/login" className="text-blue-600 font-bold hover:underline">Sign In</a>
            </p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      ` }} />
    </div>
  );
};

export default Register;