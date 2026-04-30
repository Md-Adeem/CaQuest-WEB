import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoginForm from "../components/LoginForm";
import { HiAcademicCap, HiCheckCircle } from "react-icons/hi";
import toast from "react-hot-toast";
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const { login, googleLogin } = useAuth();
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
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const user = await googleLogin(credentialResponse.credential);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === "admin" ? "/admin" : from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen -mt-16 md:-mt-[72px] flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 items-center justify-center p-12">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="absolute top-[-100px] left-[-80px] w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-80px] right-[-60px] w-[350px] h-[350px] bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{animationDelay:'1s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-[200px] h-[200px] bg-fuchsia-500/8 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-md text-white relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-14 h-14 bg-white/[0.08] backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/[0.1] shadow-2xl">
              <HiAcademicCap className="w-8 h-8 text-cyan-400" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight">CaQuest</span>
          </div>
          <h1 className="text-4xl font-extrabold mb-5 leading-tight tracking-tight">
            Ace Your CA Exams
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400 mt-1">with Confidence</span>
          </h1>
          <p className="text-lg text-slate-300/90 mb-10 leading-relaxed font-medium">
            Access thousands of chapter-wise practice questions for Foundation,
            Intermediate, and Final levels.
          </p>
          <div className="space-y-4">
            {["Chapter-wise question banks", "All CA levels covered", "Detailed explanations"].map((item, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="w-9 h-9 bg-white/[0.08] backdrop-blur-md rounded-xl flex items-center justify-center border border-white/[0.08] group-hover:bg-white/[0.15] transition-colors shadow-sm">
                  <HiCheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="font-medium text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute top-[-60px] right-[-40px] w-[250px] h-[250px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="w-full max-w-md relative z-10">
          <div className="group relative">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-3xl opacity-20 blur-sm"></div>
            <div className="relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 rounded-3xl p-8 shadow-xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Welcome Back</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
                  Sign in to continue your preparation
                </p>
              </div>

              <div className="flex justify-center mb-6">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    toast.error('Google login Failed');
                  }}
                  useOneTap
                  theme="outline"
                  size="large"
                  shape="pill"
                />
              </div>
              
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with email</span>
                </div>
              </div>

              <LoginForm onSubmit={handleLogin} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
