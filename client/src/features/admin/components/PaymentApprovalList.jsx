import React from 'react';
import PaymentApprovalCard from './PaymentApprovalCard';
import EmptyState from '../../../shared/components/EmptyState';

const PaymentApprovalList = ({ payments, onApprove, onReject }) => {
  if (payments.length === 0) {
    return (
      <EmptyState
        icon="✅"
        title="No Pending Payments"
        description="All payments have been reviewed. Check back later for new submissions."
      />
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <PaymentApprovalCard
          key={payment._id}
          payment={payment}
          onApprove={onApprove}
          onReject={onReject}
        />
      ))}
    </div>
  );
};

export default PaymentApprovalList;