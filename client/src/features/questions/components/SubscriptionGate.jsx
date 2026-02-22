import React from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '../../../shared/utils/constants';
import { HiLockClosed, HiSparkles } from 'react-icons/hi';

const SubscriptionGate = ({ level }) => {
  const levelInfo = LEVELS[level];

  return (
    <div className="max-w-lg mx-auto text-center py-16 animate-fade-in">
      <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-6">
        <HiLockClosed className="w-10 h-10 text-yellow-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Subscription Required
      </h2>
      <p className="text-gray-500 mb-2">
        You need an active subscription for{' '}
        <span className="font-semibold text-gray-700">
          {levelInfo?.name || 'this level'}
        </span>{' '}
        to access these questions.
      </p>
      <p className="text-sm text-gray-400 mb-8">
        Get unlimited access to all chapters and questions with our affordable plans.
      </p>

      <div className="space-y-3">
        <Link
          to="/subscriptions"
          className="btn-primary inline-flex items-center gap-2"
        >
          <HiSparkles className="w-5 h-5" />
          View Subscription Plans
        </Link>
        <p className="text-xs text-gray-400">
          Plans start from just ₹199/month
        </p>
      </div>
    </div>
  );
};

export default SubscriptionGate;