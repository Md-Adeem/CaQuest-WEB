import React, { useState, useEffect } from 'react';
import { HiClipboardList, HiRefresh, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import api from '../../../shared/utils/api';
import Loader from '../../../shared/components/Loader';
import AdminSidebar from '../components/AdminSidebar';
import { formatDateTime } from '../../../shared/utils/helpers';

const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterAction, setFilterAction] = useState('');

  const fetchLogs = async (currentPage = 1, action = '') => {
    try {
      setLoading(true);
      let url = `/admin/audit-logs?page=${currentPage}&limit=20`;
      if (action) url += `&action=${action}`;
      
      const res = await api.get(url);
      setLogs(res.data.data);
      setTotalPages(res.data.pagination.pages);
      setPage(res.data.pagination.page);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page, filterAction);
  }, [page, filterAction]);

  const handleFilterChange = (e) => {
    setFilterAction(e.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] relative">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-8 w-full max-w-[100vw] overflow-x-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <HiClipboardList className="w-8 h-8 text-primary-600" />
              Audit Logs
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Track user registrations and logins across the platform.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={filterAction}
              onChange={handleFilterChange}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 text-sm"
            >
              <option value="">All Actions</option>
              <option value="login">Logins Only</option>
              <option value="register">Registrations Only</option>
            </select>
            <button
              onClick={() => fetchLogs(page, filterAction)}
              className="btn-secondary flex items-center gap-2"
              title="Refresh Logs"
            >
              <HiRefresh className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading && logs.length === 0 ? (
          <Loader size="lg" text="Loading audit logs..." />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-medium text-left text-gray-600 dark:text-gray-300">
                <thead className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 uppercase">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        No audit logs found.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4">
                          {log.user ? (
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {log.user.name}
                              </div>
                              <div className="text-xs text-gray-500">{log.user.email}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">Deleted User</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            log.action === 'register' 
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {log.action.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {log.status === 'success' ? (
                            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                              <HiCheckCircle className="w-4 h-4" /> Success
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                              <HiXCircle className="w-4 h-4" /> Failed
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatDateTime(log.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs text-gray-500 bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                            {log.ipAddress || 'Unknown'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Page <span className="font-medium text-gray-900 dark:text-white">{page}</span> of{' '}
                  <span className="font-medium text-gray-900 dark:text-white">{totalPages}</span>
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuditLogsPage;
