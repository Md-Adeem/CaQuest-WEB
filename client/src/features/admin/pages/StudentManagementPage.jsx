import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { useAdminUsers } from '../hooks/useAdmin';
import Loader from '../../../shared/components/Loader';
import { HiOutlineSearch, HiBadgeCheck } from 'react-icons/hi';

const StudentManagementPage = () => {
  const { users, loading, pagination, fetchUsers } = useAdminUsers();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers({ search: searchTerm, page: 1 });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] relative">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-8 w-full max-w-[100vw] overflow-x-hidden">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Student Management
            </h1>
            <p className="text-gray-500 mt-1">
              View registered users and their active subscriptions
            </p>
          </div>
          
          <form onSubmit={handleSearch} className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </form>
        </div>

        {loading ? (
          <Loader size="lg" text="Loading students..." />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-4 font-semibold text-gray-700">Student Info</th>
                    <th className="p-4 font-semibold text-gray-700">Phone</th>
                    <th className="p-4 font-semibold text-gray-700">Active Plans</th>
                    <th className="p-4 font-semibold text-gray-700">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="p-4 text-gray-600">
                        {user.phone || '-'}
                      </td>
                      <td className="p-4">
                        {user.activeSubscriptions && user.activeSubscriptions.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            {user.activeSubscriptions.map((sub, idx) => (
                              <div key={idx} className="flex flex-col border border-primary-100 bg-primary-50 rounded-md p-2 text-xs">
                                <span className="font-bold text-primary-700 flex items-center gap-1">
                                  <HiBadgeCheck className="w-4 h-4" />
                                  {sub.plan?.name || sub.level.toUpperCase()}
                                </span>
                                <span className="text-gray-600 mt-1">
                                  Expires: {formatDate(sub.expiresAt)}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            No Active Plans
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-gray-500 text-sm">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500">
                        No students found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="p-4 border-t border-gray-100 flex justify-center gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      fetchUsers({ page: i + 1, search: searchTerm });
                    }}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      pagination.currentPage === i + 1
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentManagementPage;
