import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RegisterForm from '../components/RegisterForm';
import { HiAcademicCap } from 'react-icons/hi';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (formData) => {
    try {
      setLoading(true);
      const user = await register(formData);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <HiAcademicCap className="w-8 h-8" />
            </div>
            <span className="text-3xl font-bold">CAPrep</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Start Your CA Journey Today
          </h1>
          <p className="text-lg text-purple-100 mb-8">
            Join thousands of CA aspirants who trust our platform for their exam
            preparation. Comprehensive, structured, and effective.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-sm text-purple-200">Questions</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">5K+</div>
              <div className="text-sm text-purple-200">Students</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">3</div>
              <div className="text-sm text-purple-200">CA Levels</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">95%</div>
              <div className="text-sm text-purple-200">Pass Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-500 mt-2">
              Get started with your CA preparation
            </p>
          </div>
          <RegisterForm onSubmit={handleRegister} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;