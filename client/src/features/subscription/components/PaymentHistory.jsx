import React from 'react';
import { usePaymentHistory } from '../hooks/useSubscription';
import Badge from '../../../shared/components/Badge';
import { ListShimmer } from '../../../shared/components/Shimmer';
import { formatDate, formatCurrency } from '../../../shared/utils/helpers';
import { PAYMENT_STATUS, LEVELS } from '../../../shared/utils/constants';

const PaymentHistory = () => {
  const { payments, loading } = usePaymentHistory();

  if (loading) return <ListShimmer count={3} />;

  if (payments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No payment history found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {payments.map((payment) => {
        const status = PAYMENT_STATUS[payment.status];
        const level = LEVELS[payment.level];

        return (
          <div
            key={payment._id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{level?.icon}</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {payment.subscriptionPlan?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(payment.createdAt)} • Txn: {payment.transactionId}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900 dark:text-white">
                {formatCurrency(payment.amount)}
              </p>
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
                {status?.label}
              </Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PaymentHistory;