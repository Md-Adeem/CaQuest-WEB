// client/src/features/profile/pages/ProfilePage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import api from '../../../shared/utils/api';
import toast from 'react-hot-toast';
import { HiUser, HiMail, HiPhone, HiLockClosed, HiSave, HiCreditCard } from 'react-icons/hi';
import { formatDate, daysRemaining } from '../../../shared/utils/helpers';
import { LEVELS } from '../../../shared/utils/constants';
import Badge from '../../../shared/components/Badge';
import PaymentHistoryList from '../components/PaymentHistoryList';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.put('/auth/profile', profile);
      updateUser(response.data.data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      setLoading(true);
      await api.put('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success('Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Sleek Page Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-300 tracking-tight">
          Command Center
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Manage your identity, security, and subscription passes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Player Card */}
        <div className="lg:col-span-1">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 border border-slate-700/60 shadow-2xl text-center group">
             {/* Decorative abstract */}
             <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full transition-all duration-700 group-hover:bg-indigo-400/30"></div>
             
             <div className="relative z-10">
               <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 p-1 mx-auto mb-5 shadow-[0_0_30px_rgba(99,102,241,0.3)] group-hover:scale-105 transition-transform duration-500">
                 <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                   <span className="text-4xl font-black text-white drop-shadow-md">
                     {user?.name?.charAt(0)?.toUpperCase()}
                   </span>
                 </div>
               </div>
               <h2 className="text-2xl font-black text-white tracking-tight leading-tight mb-1">{user?.name}</h2>
               <p className="text-sm font-medium text-slate-400 mb-5">{user?.email}</p>
               <Badge variant={user?.role === 'admin' ? 'danger' : 'primary'} className="mb-2 tracking-widest font-bold">
                 {user?.role?.toUpperCase()}
               </Badge>
             </div>

            {/* Active Subscriptions */}
            <div className="mt-8 pt-6 border-t border-slate-700/80 text-left relative z-10">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                Active Passes
              </h3>
              {user?.activeSubscriptions?.length > 0 ? (
                <div className="space-y-3">
                  {user.activeSubscriptions.map((sub, i) => {
                    const level = LEVELS[sub.level];
                    const days = daysRemaining(sub.expiresAt);
                    return (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-inner hover:bg-white/10 transition-colors duration-300"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
                            <span>{level?.icon}</span> {level?.name}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${days > 7 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                            {days}d left
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-500">
                          Expires: <span className="text-slate-400">{formatDate(sub.expiresAt)}</span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm font-medium text-slate-500 italic text-center py-4 bg-white/5 rounded-xl border border-white/5">No active passes</p>
              )}
            </div>
          </div>
        </div>

        {/* Edit Forms */}
        <div className="lg:col-span-2">
          {/* Frosted Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 p-1.5 bg-gray-100/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-700/60 w-fit shadow-sm">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === 'profile'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              Edit Identity
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === 'password'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-5 py-2.5 rounded-xl text-sm flex gap-2 items-center font-bold transition-all duration-300 ${
                activeTab === 'payments'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              <HiCreditCard className="w-4 h-4" />
              Transactions
            </button>
          </div>

          {activeTab === 'profile' ? (
            <div className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-indigo-500/5">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                Profile Identity
              </h2>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 w-5 h-5 pointer-events-none" />
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-4 py-3 pl-12 text-gray-900 dark:text-white transition-all shadow-sm font-medium"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                    Primary Email
                  </label>
                  <div className="relative">
                    <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <input
                      type="email"
                      value={user?.email}
                      className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 pl-12 text-gray-500 dark:text-gray-500 font-medium cursor-not-allowed"
                      disabled
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                    Contact Number
                  </label>
                  <div className="relative">
                    <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 w-5 h-5 pointer-events-none" />
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-4 py-3 pl-12 text-gray-900 dark:text-white transition-all shadow-sm font-medium"
                      placeholder="9876543210"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex justify-center items-center gap-2 w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                  >
                    <HiSave className="w-5 h-5" />
                    {loading ? 'Committing...' : 'Save Identity'}
                  </button>
                </div>
              </form>
            </div>
          ) : activeTab === 'password' ? (
            <div className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-rose-500/5">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                Security & Authentication
              </h2>
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 w-5 h-5 pointer-events-none" />
                    <input
                      type="password"
                      value={passwords.currentPassword}
                      onChange={(e) =>
                        setPasswords({ ...passwords, currentPassword: e.target.value })
                      }
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 rounded-xl px-4 py-3 pl-12 text-gray-900 dark:text-white transition-all shadow-sm font-medium"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                    New Password
                  </label>
                  <div className="relative">
                    <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 w-5 h-5 pointer-events-none" />
                    <input
                      type="password"
                      value={passwords.newPassword}
                      onChange={(e) =>
                        setPasswords({ ...passwords, newPassword: e.target.value })
                      }
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 rounded-xl px-4 py-3 pl-12 text-gray-900 dark:text-white transition-all shadow-sm font-medium"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 w-5 h-5 pointer-events-none" />
                    <input
                      type="password"
                      value={passwords.confirmPassword}
                      onChange={(e) =>
                        setPasswords({ ...passwords, confirmPassword: e.target.value })
                      }
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 rounded-xl px-4 py-3 pl-12 text-gray-900 dark:text-white transition-all shadow-sm font-medium"
                      required
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex justify-center items-center gap-2 w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.4)] hover:shadow-[0_0_25px_rgba(244,63,94,0.6)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                  >
                    <HiLockClosed className="w-5 h-5" />
                    {loading ? 'Securing...' : 'Secure Account'}
                  </button>
                </div>
              </form>
            </div>
          ) : activeTab === 'payments' ? (
            <div className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700/60 rounded-3xl p-4 sm:p-6 shadow-xl shadow-indigo-500/5">
              <PaymentHistoryList />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;