import React from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminStats from '../components/AdminStats';
import { useAdminStats } from '../hooks/useAdmin';
import Loader from '../../../shared/components/Loader';
import { formatCurrency, formatDateTime } from '../../../shared/utils/helpers';
import Badge from '../../../shared/components/Badge';
import { LEVELS } from '../../../shared/utils/constants';

const AdminDashboardPage = () => {
  const { stats, loading } = useAdminStats();

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Overview of your platform's performance
          </p>
        </div>

        {loading ? (
          <Loader size="lg" text="Loading dashboard..." />
        ) : (
          <>
            <div className="mb-8">
              <AdminStats stats={stats} />
            </div>

            {/* Recent Payments */}
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Recent Payments
              </h2>
              {stats?.recentPayments?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">
                          Student
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">
                          Plan
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">
                          Amount
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentPayments.map((payment) => (
                        <tr
                          key={payment._id}
                          className="border-b border-gray-50 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <p className="font-medium text-gray-900">
                              {payment.user?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {payment.user?.email}
                            </p>
                          </td>
                          <td className="py-3 px-4">
                            {payment.subscriptionPlan?.name}
                          </td>
                          <td className="py-3 px-4 font-medium">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                payment.status === 'approved'
                                  ? 'success'
                                  : payment.status === 'rejected'
                                  ? 'danger'
                                  : 'warning'
                              }
                              size="sm"
                            >
                              {payment.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-500">
                            {formatDateTime(payment.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No payments yet.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;