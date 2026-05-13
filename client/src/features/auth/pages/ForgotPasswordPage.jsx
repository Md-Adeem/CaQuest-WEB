import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiAcademicCap, HiMail, HiArrowLeft, HiCheckCircle } from "react-icons/hi";
import toast from "react-hot-toast";
import api from "../../../shared/utils/api";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    if (!email.toLowerCase().endsWith("@gmail.com") && !email.toLowerCase().endsWith("@caquest.com")) {
      toast.error("Only @gmail.com addresses are allowed");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
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
        <div className="absolute bottom-[-80px] right-[-60px] w-[350px] h-[350px] bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/3 w-[200px] h-[200px] bg-fuchsia-500/8 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-md text-white relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-14 h-14 bg-white/[0.08] backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/[0.1] shadow-2xl">
              <HiAcademicCap className="w-8 h-8 text-cyan-400" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight">CaQuest</span>
          </div>
          <h1 className="text-4xl font-extrabold mb-5 leading-tight tracking-tight">
            Don't Worry,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400 mt-1">
              We've Got You
            </span>
          </h1>
          <p className="text-lg text-slate-300/90 mb-10 leading-relaxed font-medium">
            Enter your email and we'll send you a secure link to reset your
            password. You'll be back to studying in no time!
          </p>
          <div className="space-y-4">
            {["Check your email inbox", "Click the reset link", "Create a new password"].map((item, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="w-9 h-9 bg-white/[0.08] backdrop-blur-md rounded-xl flex items-center justify-center border border-white/[0.08] group-hover:bg-white/[0.15] transition-colors shadow-sm">
                  <span className="text-sm font-bold text-cyan-400">{i + 1}</span>
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
              {!sent ? (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <HiMail className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                      Forgot Password?
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
                      No worries! Enter your email to get a reset link.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <HiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="input-field pl-10"
                          placeholder="you@gmail.com"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full flex items-center justify-center"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "Send Reset Link"
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <HiCheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                    Check Your Email
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 font-medium mb-6">
                    We've sent a password reset link to{" "}
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">{email}</span>.
                    Please check your inbox.
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
                    Didn't receive it? Check your spam folder or{" "}
                    <button
                      onClick={() => setSent(false)}
                      className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                    >
                      try again
                    </button>
                  </p>
                </div>
              )}

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors"
                >
                  <HiArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
