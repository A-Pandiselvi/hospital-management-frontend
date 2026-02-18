import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, Hospital, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { users } from '../../users';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      setErrors({ password: "Invalid email or password" });
      return;
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", foundUser.role);
    localStorage.setItem("userName", foundUser.name);
    navigate(`/${foundUser.role}/dashboard`);
  };

  return (
    <>
   <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">

      {/* Main Container */}
      <div className="max-w-5xl w-full bg-white border border-blue-300 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
<div className="w-full md:w-1/2 bg-gradient-to-b from-blue-900 to-blue-800 p-8 text-white flex flex-col justify-between relative overflow-hidden">

  {/* Animated Decorative Blobs */}
  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
  <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-cyan-300/20 rounded-full blur-3xl animate-bounce [animation-duration:6s]"></div>
  
  <div className="relative z-10">
    {/* Floating Icon Animation */}
    <div className="flex items-center space-x-3 mb-10 animate-[bounce_3s_infinite]">
      <div className="bg-white/20 backdrop-blur-xl p-3 rounded-2xl shadow-inner border border-white/30">
        <Hospital className="h-10 w-10 text-white" />
      </div>
      <span className="text-3xl font-black tracking-tighter uppercase italic">MediFlow</span>
    </div>
    
    {/* Staggered Entrance Text */}
    <div className="space-y-6 animate-[fadeIn_1s_ease-out]">
      <h2 className="text-5xl font-extrabold leading-[1.1] tracking-tight">
        Better Care <br /> 
        <span className="text-cyan-200">Starts Here.</span>
      </h2>
      
      <div className="h-1 w-20 bg-cyan-300 rounded-full animate-[stretch_2s_ease-in-out_infinite]"></div>
      
      <p className="text-blue-50 text-lg max-w-sm leading-relaxed opacity-90">
        The most intuitive hospital management system designed for modern healthcare professionals.
      </p>
    </div>
  </div>

  {/* Glassmorphism Badge at bottom */}
  <div className="relative z-10 mt-auto pt-8">
    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center space-x-4">
      <div className="flex -space-x-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-8 h-8 rounded-full border-2 border-blue-500 bg-blue-100 flex items-center justify-center text-[10px] text-blue-600 font-bold">
            DR
          </div>
        ))}
      </div>
      <p className="text-xs font-medium text-blue-50">Trusted by 500+ Medical Staff</p>
    </div>
  </div>
</div>

        {/* Right Side: Form Section */}
       <div className="w-full md:w-1/2 p-8 md:p-10 bg-blue-50 flex flex-col justify-center">
          <div className="mb-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h3>
            <p className="text-gray-500 font-medium">Please enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 transition-colors ${errors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'}`} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 bg-gray-50 border-2 rounded-xl outline-none transition-all duration-200 ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 focus:bg-white'
                  }`}
                  placeholder="name@hospital.com"
                />
              </div>
              {errors.email && <p className="text-xs font-bold text-red-500 ml-1">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
                <a href="/forgot-password" hidden={false} className="text-xs font-bold text-blue-600 hover:text-cyan-600 transition-colors">
                  Forgot?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 transition-colors ${errors.password ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'}`} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-12 pr-12 py-3 bg-gray-50 border-2 rounded-xl outline-none transition-all duration-200 ${
                    errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 focus:bg-white'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs font-bold text-red-500 ml-1">{errors.password}</p>}
            </div>

            {/* Login Button */}
            <button
              type="submit"
            className="w-full bg-blue-800 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all duration-300 shadow-xl shadow-blue-900/40 flex items-center justify-center space-x-2 mt-4"

            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-gray-500">
              Don't have an account?{' '}
             <button
  type="button"
  onClick={() => {
    localStorage.removeItem("email_verified");
    localStorage.removeItem("verified_email");
    localStorage.removeItem("pending_email");
    navigate("/register");
  }}
  className="text-blue-600 font-bold hover:underline"
>
  Contact Administrator
</button>

            </p>
          </div>
        </div>
      </div>
    </div>
    <style>
      ${`
      @keyframes stretch {
    0%, 100% { width: 5rem; }
    50% { width: 8rem; }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }`}
    </style>
    </>
  );
};

export default Login;