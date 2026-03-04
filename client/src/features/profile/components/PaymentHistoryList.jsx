import React, { useState, useEffect } from 'react';
import api from '../../../shared/utils/api';
import toast from 'react-hot-toast';
import { HiCreditCard, HiCalendar, HiCurrencyRupee } from 'react-icons/hi';
import Badge from '../../../shared/components/Badge';
import Loader from '../../../shared/components/Loader';
import { formatDate } from '../../../shared/utils/helpers';

const PaymentHistoryList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await api.get('/payments/my-payments');
        setPayments(response.data.data);
      } catch (err) {
        toast.error('Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="card text-center py-12">
        <Loader text="Loading your invoices..." />
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="card text-center py-12">
        <HiCreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Payment History</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
          You haven't made any subscription purchases yet.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <HiCreditCard className="text-primary-600" />
        Payment History
      </h2>

      <div className="space-y-4">
        {payments.map((payment) => (
          <div
            key={payment._id}
            className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:shadow-sm transition-shadow bg-gray-50 dark:bg-gray-900/50 flex flex-col sm:flex-row gap-4 sm:items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {payment.subscriptionPlan?.name || 'Subscription Plan'}
                </h3>
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
                  {payment.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="flex flex-wrap text-sm text-gray-500 dark:text-gray-400 gap-x-4 gap-y-1 mt-2">
                <span className="flex items-center gap-1">
                  <HiCalendar className="w-4 h-4 text-gray-400" />
                  {formatDate(payment.createdAt)}
                </span>
                <span className="flex items-center gap-1 font-medium text-gray-700 dark:text-gray-200">
                  <HiCurrencyRupee className="w-4 h-4 text-gray-400" />
                  ₹{payment.amount}
                </span>
                {payment.transactionId && (
                  <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-500 dark:text-gray-400 flex items-center">
                    ID: {payment.transactionId}
                  </span>
                )}
              </div>

              {payment.status === 'rejected' && payment.rejectionReason && (
                <div className="mt-3 p-2 bg-red-50 border border-red-100 rounded text-sm text-red-600">
                  Reason: {payment.rejectionReason}
                </div>
              )}
            </div>

            {/* Quick Summary Right Side */}
            <div className="text-right flex flex-col sm:items-end sm:border-l sm:border-gray-200 dark:border-gray-700 sm:pl-4">
               <span className="text-sm text-gray-500 dark:text-gray-400">Duration</span>
               <span className="font-semibold text-gray-900 dark:text-white">
                 {payment.subscriptionPlan?.durationLabel || `${payment.subscriptionPlan?.duration} Days`}
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistoryList;
