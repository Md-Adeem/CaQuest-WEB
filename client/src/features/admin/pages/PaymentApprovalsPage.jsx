import React from 'react';
import AdminSidebar from '../components/AdminSidebar';
import PaymentApprovalList from '../components/PaymentApprovalList';
import { useAdminPayments } from '../hooks/useAdmin';
import Loader from '../../../shared/components/Loader';

const PaymentApprovalsPage = () => {
  const {
    payments,
    loading,
    status,
    setStatus,
    approvePayment,
    rejectPayment,
  } = useAdminPayments('pending');

  const statusTabs = [
    { id: 'pending', label: 'Pending', count: null },
    { id: 'approved', label: 'Approved', count: null },
    { id: 'rejected', label: 'Rejected', count: null },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] relative">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-8 w-full max-w-[100vw] overflow-x-hidden">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Payment Approvals
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Review and manage student payment submissions
          </p>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 mb-6">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatus(tab.id)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                status === tab.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Payments List */}
        {loading ? (
          <Loader size="lg" text="Loading payments..." />
        ) : (
          <PaymentApprovalList
            payments={payments}
            onApprove={approvePayment}
            onReject={rejectPayment}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentApprovalsPage;