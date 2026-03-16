import React from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '../../../shared/utils/constants';
import { daysRemaining, formatDate } from '../../../shared/utils/helpers';
import Badge from '../../../shared/components/Badge';
import { HiClock, HiCheckCircle } from 'react-icons/hi';

const SubscriptionStatus = ({ subscriptions }) => {
  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Your Subscriptions
        </h3>
        <div className="text-center py-6">
          <div className="text-4xl mb-3">🔒</div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No active subscriptions yet. Subscribe to access question banks.
          </p>
          <Link to="/subscriptions" className="btn-primary text-sm">
            View Plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Your Subscriptions
      </h3>
      <div className="space-y-3">
        {subscriptions.map((sub, index) => {
          const level = LEVELS[sub.level];
          const days = daysRemaining(sub.expiresAt);
          const isExpired = days === 0;

          return (
            <div
              key={index}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg border ${
                isExpired 
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50' 
                  : `${level?.bgColor} dark:bg-gray-700/50 ${level?.borderColor} dark:border-gray-600`
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{level?.icon}</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{level?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Expires: {formatDate(sub.expiresAt)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {isExpired ? (
                  <Badge variant="danger">Expired</Badge>
                ) : (
                  <div className="flex items-center gap-1">
                    {days <= 7 ? (
                      <HiClock className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <HiCheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    <Badge variant={days <= 7 ? 'warning' : 'success'}>
                      {days} days left
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionStatus;