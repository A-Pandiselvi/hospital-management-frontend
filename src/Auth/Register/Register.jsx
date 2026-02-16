import React, { useState, useEffect } from 'react';
import { User, Mail, UserPlus, CheckCircle } from 'lucide-react';

const Register = () => {
const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

  const [errors, setErrors] = useState({});
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleVerifyEmail = () => {
  if (!formData.email.trim()) {
    setErrors({ email: "Enter email first" });
    return;
  }

  // Save email temporarily
  localStorage.setItem("pending_email", formData.email);

  // go to otp page
  window.location.href = "/verify-otp";
};

  const handleSubmit = (e) => {
    if (!isVerified) {
  alert("Please verify your email first");
  return;
}

  e.preventDefault();

  const newErrors = {};
  if (!formData.name.trim()) newErrors.name = 'Name is required';
  if (!formData.email.trim()) newErrors.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  const verified = localStorage.getItem("email_verified");
  const verifiedEmail = localStorage.getItem("pending_email");

  if (verified !== "true" || verifiedEmail !== formData.email) {
    alert("Please verify your email first");
    return;
  }

  console.log("Account Created:", formData);

  localStorage.removeItem("email_verified");
  localStorage.removeItem("pending_email");

  window.location.href = "/login";
};

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md w-full">
          <div className="inline-block bg-green-100 rounded-full p-6 mb-6">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-4">
            Please check your email for OTP verification.
          </p>
          <div className="animate-pulse text-blue-600">
            Redirecting to OTP verification...
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
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-blue-100">Join Hospital Management System</p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {/* Info Banner */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> You'll receive an OTP on your email for verification.
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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                      readOnly={isVerified}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
{!isVerified && (
<button
  type="button"
  onClick={handleVerifyEmail}
  className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
>
  Verify Email
</button>
)}

              </div>
              {/* Name Input */}
              {isVerified && (
                <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.name ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
{/* Password */}
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Password
  </label>
  <input
    type="password"
    name="password"
    value={formData.password}
    onChange={handleChange}
    className="w-full py-3 px-4 border-2 rounded-lg border-gray-200"
  />
</div>

{/* Confirm Password */}
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Confirm Password
  </label>
  <input
    type="password"
    name="confirmPassword"
    value={formData.confirmPassword}
    onChange={handleChange}
    className="w-full py-3 px-4 border-2 rounded-lg border-gray-200"
  />
</div>



              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center space-x-2"
              >
                <UserPlus className="h-5 w-5" />
                <span>Create Account</span>
             </button>
</>
)}
</form>

            {/* Divider */}
            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <a 
                href="/login" 
                className="text-blue-600 hover:text-blue-500 font-semibold transition-colors"
              >
                Sign In Instead →
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

export default Register;