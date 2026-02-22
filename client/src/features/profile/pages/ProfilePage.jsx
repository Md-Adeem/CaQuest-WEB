// client/src/features/profile/pages/ProfilePage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import api from '../../../shared/utils/api';
import toast from 'react-hot-toast';
import { HiUser, HiMail, HiPhone, HiLockClosed, HiSave } from 'react-icons/hi';
import { formatDate, daysRemaining } from '../../../shared/utils/helpers';
import { LEVELS } from '../../../shared/utils/constants';
import Badge from '../../../shared/components/Badge';

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card text-center">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-700">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <div className="mt-4">
              <Badge variant={user?.role === 'admin' ? 'danger' : 'primary'}>
                {user?.role?.toUpperCase()}
              </Badge>
            </div>

            {/* Active Subscriptions */}
            <div className="mt-6 pt-6 border-t border-gray-100 text-left">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Active Subscriptions
              </h3>
              {user?.activeSubscriptions?.length > 0 ? (
                <div className="space-y-2">
                  {user.activeSubscriptions.map((sub, i) => {
                    const level = LEVELS[sub.level];
                    const days = daysRemaining(sub.expiresAt);
                    return (
                      <div
                        key={i}
                        className={`p-3 rounded-lg ${level?.bgColor} ${level?.borderColor} border`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {level?.icon} {level?.name}
                          </span>
                          <Badge variant={days > 7 ? 'success' : 'warning'} size="sm">
                            {days}d left
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Expires: {formatDate(sub.expiresAt)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No active subscriptions</p>
              )}
            </div>
          </div>
        </div>

        {/* Edit Forms */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'password'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Change Password
            </button>
          </div>

          {activeTab === 'profile' ? (
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Edit Profile Information
              </h2>
              <form onSubmit={handleProfileUpdate} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (cannot change)
                  </label>
                  <div className="relative">
                    <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={user?.email}
                      className="input-field pl-10 bg-gray-50 cursor-not-allowed"
                      disabled
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      className="input-field pl-10"
                      placeholder="9876543210"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  <HiSave className="w-5 h-5" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          ) : (
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Change Password
              </h2>
              <form onSubmit={handlePasswordChange} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      value={passwords.currentPassword}
                      onChange={(e) =>
                        setPasswords({ ...passwords, currentPassword: e.target.value })
                      }
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      value={passwords.newPassword}
                      onChange={(e) =>
                        setPasswords({ ...passwords, newPassword: e.target.value })
                      }
                      className="input-field pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      value={passwords.confirmPassword}
                      onChange={(e) =>
                        setPasswords({ ...passwords, confirmPassword: e.target.value })
                      }
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  <HiLockClosed className="w-5 h-5" />
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;