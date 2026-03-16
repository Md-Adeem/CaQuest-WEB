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
      className={`relative h-full flex flex-col pt-8 px-6 pb-6 rounded-3xl bg-white dark:bg-gray-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
        plan.isPopular 
          ? 'ring-2 ring-primary-500 shadow-xl shadow-primary-500/10 scale-[1.02]' 
          : 'border border-gray-100 dark:border-gray-700 shadow-lg'
      }`}
    >
      {/* Promotional Tag Floating Badge */}
      {plan.tag && (
        <div className="absolute -top-4 -right-3 z-20 transform rotate-3 hover:rotate-6 transition-transform hover:scale-110">
          <span className="inline-flex items-center gap-1 bg-gradient-to-br from-orange-400 to-red-500 text-white text-xs font-extrabold px-4 py-1.5 rounded-2xl shadow-xl shadow-red-500/30 border border-white/20 uppercase tracking-[0.15em]">
            ✨ {plan.tag}
          </span>
        </div>
      )}

      {/* Popular Badge */}
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <span className="bg-primary-600 text-white text-[11px] font-bold px-4 py-1 rounded-full flex items-center gap-1 shadow-md shadow-primary-500/20">
            <HiStar className="w-3 h-3" />
            MOST POPULAR
          </span>
        </div>
      )}

      <div className="text-center">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${levelInfo?.bgColor} dark:bg-gray-700/80 ${levelInfo?.textColor} dark:text-blue-200`}
        >
          <span>{levelInfo?.icon}</span>
          <span>{levelInfo?.name}</span>
        </div>

        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-6">{plan.durationLabel}</p>

        <div className="mb-8 flex flex-col items-center justify-center min-h-[80px]">
          {plan.originalPrice && plan.originalPrice > plan.price && (
            <span className="text-sm font-semibold text-gray-400 dark:text-gray-500 line-through mb-1">
              {formatCurrency(plan.originalPrice)}
            </span>
          )}
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tight">
              {formatCurrency(plan.price)}
            </span>
            {plan.price > 0 && (
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                 / {plan.duration}d
              </span>
            )}
          </div>
        </div>

        <ul className="space-y-4 mb-8 text-left flex-1">
          {plan.features?.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="mt-0.5 bg-green-100 dark:bg-green-900/30 p-1 rounded-full text-green-600 dark:text-green-400 flex-shrink-0">
                <HiCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-tight">
                {feature}
              </span>
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
          className={`w-full py-3.5 rounded-xl font-bold transition-all duration-300 ${
            plan.level === 'intermediate' || plan.level === 'final'
              ? 'bg-gray-100 dark:bg-gray-800/50 text-gray-400 cursor-not-allowed border border-gray-200 dark:border-gray-700'
              : plan.isPopular
              ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-primary-500/30 active:scale-95'
              : 'bg-white dark:bg-gray-800 border-2 border-primary-100 dark:border-primary-900/50 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-200 dark:hover:border-primary-800 active:scale-95'
          }`}
        >
          {plan.level === 'intermediate' || plan.level === 'final' ? 'Coming soon...' : 'Subscribe Now'}
        </button>
      </div>
    </div>
  );
};

export default PlanCard;