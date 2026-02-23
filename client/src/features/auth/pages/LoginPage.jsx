import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoginForm from "../components/LoginForm";
import { HiAcademicCap } from "react-icons/hi";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async (formData) => {
    try {
      setLoading(true);
      const user = await login(formData.email, formData.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === "admin" ? "/admin" : from, { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg items-center justify-center p-12">
        <div className="max-w-md text-white">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <HiAcademicCap className="w-8 h-8" />
            </div>
            <span className="text-3xl font-bold">CaQuest</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Ace Your CA Exams with Confidence
          </h1>
          <p className="text-lg text-blue-100 mb-8">
            Access thousands of chapter-wise practice questions for Foundation,
            Intermediate, and Final levels. Start your journey to becoming a
            Chartered Accountant today.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">
                ✓
              </div>
              <span>Chapter-wise question banks</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">
                ✓
              </div>
              <span>All CA levels covered</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">
                ✓
              </div>
              <span>Detailed explanations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-500 mt-2">
              Sign in to continue your preparation
            </p>
          </div>
          <LoginForm onSubmit={handleLogin} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
