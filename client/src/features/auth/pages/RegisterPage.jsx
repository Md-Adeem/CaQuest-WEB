import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import RegisterForm from "../components/RegisterForm";
import { HiAcademicCap } from "react-icons/hi";
import toast from "react-hot-toast";
import { GoogleLogin } from '@react-oauth/google';

const RegisterPage = () => {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (formData) => {
    try {
      setLoading(true);
      const user = await register(formData);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const user = await googleLogin(credentialResponse.credential);
      toast.success(`Welcome back, ${user.name}!`);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Google registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const highlights = [
    { value: "5K+", label: "Questions" },
    { value: "2K+", label: "Students" },
    { value: "3", label: "CA Levels" },
    { value: "95%", label: "Pass Rate" },
  ];

  return (
    <div className="min-h-screen -mt-16 md:-mt-[72px] flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 items-center justify-center p-12">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="absolute top-[-100px] right-[-80px] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-80px] left-[-60px] w-[350px] h-[350px] bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{animationDelay:'1s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-[200px] h-[200px] bg-fuchsia-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-md text-white relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-14 h-14 bg-white/[0.08] backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/[0.1] shadow-2xl">
              <HiAcademicCap className="w-8 h-8 text-cyan-400" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight">CaQuest</span>
          </div>
          <h1 className="text-4xl font-extrabold mb-5 leading-tight tracking-tight">
            Start Your CA
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-300 to-emerald-400 mt-1">Journey Today</span>
          </h1>
          <p className="text-lg text-slate-300/90 mb-10 leading-relaxed font-medium">
            Join thousands of CA aspirants who trust CaQuest for their exam preparation.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {highlights.map((h, i) => (
              <div key={i} className="group relative">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                <div className="relative bg-white/[0.06] backdrop-blur-xl rounded-2xl p-5 text-center border border-white/[0.08] hover:bg-white/[0.12] transition-colors shadow-sm">
                  <div className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300">{h.value}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">{h.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute bottom-[-60px] left-[-40px] w-[250px] h-[250px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="w-full max-w-md relative z-10">
          <div className="group relative">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500 to-cyan-500 rounded-3xl opacity-20 blur-sm"></div>
            <div className="relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 rounded-3xl p-8 shadow-xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Create Account</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
                  Get started with your CA preparation
                </p>
              </div>

              <div className="flex justify-center mb-6">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    toast.error('Google login Failed');
                  }}
                  theme="outline"
                  size="large"
                  shape="pill"
                  text="signup_with"
                />
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or sign up with email</span>
                </div>
              </div>

              <RegisterForm onSubmit={handleRegister} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
