import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LEVELS } from '../../../shared/utils/constants';
import { formatCurrency } from '../../../shared/utils/helpers';
import { HiCheck, HiStar } from 'react-icons/hi';

const PlanCard = ({ plan }) => {
  const navigate = useNavigate();
  const levelInfo = LEVELS[plan.level];

  return (
    <div
      className={`relative card ${
        plan.isPopular ? 'ring-2 ring-primary-500 scale-[1.02]' : ''
      }`}
    >
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary-600 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
            <HiStar className="w-3 h-3" />
            MOST POPULAR
          </span>
        </div>
      )}

      <div className="text-center">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${levelInfo?.bgColor} ${levelInfo?.textColor}`}
        >
          <span>{levelInfo?.icon}</span>
          <span>{levelInfo?.name}</span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
        <p className="text-sm text-gray-500 mb-4">{plan.durationLabel}</p>

        <div className="mb-6">
          {plan.originalPrice && plan.originalPrice > plan.price && (
            <span className="text-sm text-gray-400 line-through mr-2">
              {formatCurrency(plan.originalPrice)}
            </span>
          )}
          <span className="text-4xl font-bold text-gray-900">
            {formatCurrency(plan.price)}
          </span>
        </div>

        <ul className="space-y-3 mb-8 text-left">
          {plan.features?.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
              <HiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => {
            if (plan.level !== 'intermediate' && plan.level !== 'final') {
              navigate(`/payment/${plan._id}`);
            }
          }}
          disabled={plan.level === 'intermediate' || plan.level === 'final'}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
            plan.level === 'intermediate' || plan.level === 'final'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : plan.isPopular
              ? 'btn-primary hover:shadow-lg hover:-translate-y-0.5'
              : 'bg-white border-2 border-primary-100 text-primary-600 hover:bg-primary-50 hover:border-primary-200'
          }`}
        >
          {plan.level === 'intermediate' || plan.level === 'final' ? 'Coming soon...' : 'Subscribe Now'}
        </button>
      </div>
    </div>
  );
};

export default PlanCard;