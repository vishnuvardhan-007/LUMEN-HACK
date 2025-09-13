import React, { useState } from 'react';
import { FaHome, FaInstagram, FaTwitter, FaLinkedin, FaEye, FaEyeSlash, FaUser, FaLock, FaEnvelope, FaUserShield } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:8000/api/register/', {
        username: formData.email,
        first_name: formData.name,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        role: formData.role
      });
      
      alert('Registration successful! Please login.');
      window.location.href = '/login';
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      const errorMsg = error.response?.data?.email?.[0] || 
                      error.response?.data?.password?.[0] || 
                      error.response?.data?.non_field_errors?.[0] ||
                      JSON.stringify(error.response?.data) ||
                      'Please try again';
      alert('Registration failed: ' + errorMsg);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-2 sm:p-4"
      style={{
        backgroundImage: 'url(/Lumen-Technologies-background.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative z-10 bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md mx-4 p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
          <p className="text-sm sm:text-base text-gray-600">Join us today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full pl-10 pr-12 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              className="w-full pl-10 pr-12 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="relative">
            <FaUserShield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              required
            >
              <option value="user">User Account</option>
              <option value="admin">Admin Account</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-purple-700 transition duration-200 font-semibold"
          >
            Create Account
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-sm sm:text-base text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-6 sm:mt-8">
          <div className="flex items-center justify-center space-x-3 sm:space-x-4">
            <a href="/" className="p-2 sm:p-3 bg-gray-100 rounded-full hover:bg-blue-100 transition">
              <FaHome className="text-sm sm:text-base text-gray-600 hover:text-blue-600" />
            </a>
            <a href="https://www.instagram.com/lumen_india/" target="_blank" rel="noopener noreferrer" className="p-2 sm:p-3 bg-gray-100 rounded-full hover:bg-pink-100 transition">
              <FaInstagram className="text-sm sm:text-base text-gray-600 hover:text-pink-600" />
            </a>
            <a href="https://x.com/lumen_india" target="_blank" rel="noopener noreferrer" className="p-2 sm:p-3 bg-gray-100 rounded-full hover:bg-blue-100 transition">
              <FaTwitter className="text-sm sm:text-base text-gray-600 hover:text-blue-400" />
            </a>
            <a href="https://in.linkedin.com/company/lumen-technologies-india" target="_blank" rel="noopener noreferrer" className="p-2 sm:p-3 bg-gray-100 rounded-full hover:bg-blue-100 transition">
              <FaLinkedin className="text-sm sm:text-base text-gray-600 hover:text-blue-700" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;