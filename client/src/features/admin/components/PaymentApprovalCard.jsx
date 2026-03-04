import React, { useState } from 'react';
import Badge from '../../../shared/components/Badge';
import Modal from '../../../shared/components/Modal';
import { formatCurrency, formatDateTime } from '../../../shared/utils/helpers';
import { LEVELS, PAYMENT_METHODS } from '../../../shared/utils/constants';
import { HiCheck, HiX, HiEye } from 'react-icons/hi';

const PaymentApprovalCard = ({ payment, onApprove, onReject }) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const level = LEVELS[payment.level];
  const method = PAYMENT_METHODS.find((m) => m.id === payment.paymentMethod);

  const handleReject = () => {
    onReject(payment._id, rejectReason);
    setShowRejectModal(false);
    setRejectReason('');
  };

  return (
    <>
      <div className="card border-l-4 border-l-yellow-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* User & Plan Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-sm font-bold text-primary-700">
                  {payment.user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {payment.user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{payment.user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Plan</p>
                <p className="text-sm font-medium">
                  {payment.subscriptionPlan?.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Level</p>
                <div className="flex items-center gap-1">
                  <span>{level?.icon}</span>
                  <span className="text-sm font-medium capitalize">
                    {payment.level}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatCurrency(payment.amount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Method</p>
                <p className="text-sm font-medium">
                  {method?.icon} {method?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Transaction ID</p>
                <p className="text-sm font-mono text-gray-700 dark:text-gray-200">
                  {payment.transactionId}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Submitted</p>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {formatDateTime(payment.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          {payment.status === 'pending' && (
            <div className="flex items-center gap-2">
              {payment.screenshotUrl && (
                <a
                  href={payment.screenshotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-sm flex items-center gap-1"
                >
                  <HiEye className="w-4 h-4" />
                  View
                </a>
              )}
              <button
                onClick={() => onApprove(payment._id)}
                className="btn-success text-sm flex items-center gap-1"
              >
                <HiCheck className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="btn-danger text-sm flex items-center gap-1"
              >
                <HiX className="w-4 h-4" />
                Reject
              </button>
            </div>
          )}

          {payment.status !== 'pending' && (
            <Badge
              variant={
                payment.status === 'approved' ? 'success' : 'danger'
              }
              size="lg"
            >
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </Badge>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Payment"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please provide a reason for rejecting this payment.
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="input-field h-24 resize-none"
            placeholder="Enter rejection reason..."
          />
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowRejectModal(false)}
              className="btn-secondary text-sm"
            >
              Cancel
            </button>
            <button onClick={handleReject} className="btn-danger text-sm">
              Confirm Rejection
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PaymentApprovalCard;