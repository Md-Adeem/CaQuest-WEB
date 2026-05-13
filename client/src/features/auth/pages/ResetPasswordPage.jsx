import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { HiAcademicCap, HiLockClosed, HiEye, HiEyeOff, HiArrowLeft, HiCheckCircle, HiExclamationCircle } from "react-icons/hi";
import toast from "react-hot-toast";
import api from "../../../shared/utils/api";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await api.put(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
      toast.success(response.data.message);
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen -mt-16 md:-mt-[72px] flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 items-center justify-center p-12">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="absolute top-[-100px] right-[-80px] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-80px] left-[-60px] w-[350px] h-[350px] bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: "1s" }}></div>

        <div className="max-w-md text-white relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-14 h-14 bg-white/[0.08] backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/[0.1] shadow-2xl">
              <HiAcademicCap className="w-8 h-8 text-cyan-400" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight">CaQuest</span>
          </div>
          <h1 className="text-4xl font-extrabold mb-5 leading-tight tracking-tight">
            Create a New
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-300 to-emerald-400 mt-1">
              Secure Password
            </span>
          </h1>
          <p className="text-lg text-slate-300/90 mb-10 leading-relaxed font-medium">
            Choose a strong password that you haven't used before. Make it at
            least 6 characters long.
          </p>
          <div className="space-y-4">
            {["Use a mix of letters & numbers", "Avoid common passwords", "Don't reuse old passwords"].map((item, i) => (
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
        <div className="absolute bottom-[-60px] left-[-40px] w-[250px] h-[250px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="w-full max-w-md relative z-10">
          <div className="group relative">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500 to-cyan-500 rounded-3xl opacity-20 blur-sm"></div>
            <div className="relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 rounded-3xl p-8 shadow-xl">
              {!success ? (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <HiLockClosed className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                      Reset Password
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
                      Enter your new password below
                    </p>
                  </div>

                  {error && (
                    <div className="mb-5 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl flex items-start gap-2">
                      <HiExclamationCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <HiLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="input-field pl-10 pr-10"
                          placeholder="••••••••"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-300"
                        >
                          {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <HiLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showConfirm ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="input-field pl-10 pr-10"
                          placeholder="••••••••"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-300"
                        >
                          {showConfirm ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                        </button>
                      </div>
                      {confirmPassword && password !== confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading || password !== confirmPassword}
                      className="btn-primary w-full flex items-center justify-center disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "Reset Password"
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
                    Password Reset Successful!
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 font-medium mb-6">
                    Your password has been updated. You can now login with your new password.
                  </p>
                  <button
                    onClick={() => navigate("/login")}
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    Go to Login
                  </button>
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

export default ResetPasswordPage;
