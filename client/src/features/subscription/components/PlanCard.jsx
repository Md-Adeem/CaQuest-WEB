import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LEVELS } from '../../../shared/utils/constants';
import { formatCurrency } from '../../../shared/utils/helpers';
import { HiCheck, HiStar } from 'react-icons/hi';

const PlanCard = ({ plan }) => {
  const navigate = useNavigate();
  const levelInfo = LEVELS[plan.level];
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!plan.tag) return;

    const updateTimer = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay - now;
      if (diff <= 0) {
        setTimeLeft('00:00:00');
        return;
      }
      
      const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const s = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
      
      setTimeLeft(`${h}:${m}:${s}`);
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    return () => clearInterval(timerId);
  }, [plan.tag]);

  return (
    <div
      className={`relative h-full flex flex-col pt-8 px-6 pb-6 rounded-[2.5rem] bg-gradient-to-br from-[#0b0f19] via-slate-900 to-[#0b0f19] border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group ${
        plan.isPopular 
          ? 'border-indigo-500/50 shadow-xl shadow-indigo-500/20 scale-[1.02]' 
          : 'border-slate-700/60 shadow-lg shadow-black/50'
      }`}
    >
      {/* Decorative ambient glows inside the ticket */}
      <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-[70px] pointer-events-none transition-all duration-700 ${plan.isPopular ? 'bg-indigo-500/20 group-hover:bg-indigo-400/30' : 'bg-slate-500/10 group-hover:bg-slate-400/20'}`}></div>
      <div className={`absolute bottom-0 left-0 w-48 h-48 rounded-full blur-[70px] pointer-events-none transition-all duration-700 ${plan.isPopular ? 'bg-cyan-500/10 group-hover:bg-cyan-400/20' : 'bg-transparent'}`}></div>

      {/* Ticket Cutouts */}
      <div className="absolute top-1/2 -left-3 w-6 h-6 bg-gray-50 dark:bg-gray-900 rounded-full border border-r-0 border-transparent z-10 hidden md:block" style={{ boxShadow: 'inset -2px 0 5px rgba(0,0,0,0.1)' }}></div>
      <div className="absolute top-1/2 -right-3 w-6 h-6 bg-gray-50 dark:bg-gray-900 rounded-full border border-l-0 border-transparent z-10 hidden md:block" style={{ boxShadow: 'inset 2px 0 5px rgba(0,0,0,0.1)' }}></div>

      {/* Promotional Tag Floating Badge */}
      {plan.tag && (
        <div className="absolute -top-4 -right-3 z-30 transform rotate-3 hover:rotate-6 transition-transform hover:scale-110">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-br from-orange-400 to-rose-500 text-white text-[10px] font-black px-4 py-1.5 rounded-2xl shadow-xl shadow-rose-500/30 border border-white/20 uppercase tracking-[0.2em]">
            ✨ {plan.tag}
            {timeLeft && (
              <span className="bg-rose-900/40 px-1.5 py-0.5 rounded text-[10px] tracking-widest font-mono ml-1 border border-rose-400/30">
                {timeLeft}
              </span>
            )}
          </span>
        </div>
      )}

      {/* Popular Badge */}
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
          <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1 rounded-full flex items-center gap-1 shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-indigo-300/30">
            <HiStar className="w-3 h-3 text-yellow-300" />
            Recommended Pass
          </span>
        </div>
      )}

      <div className="text-center relative z-20 flex flex-col h-full">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6 border ${plan.isPopular ? 'bg-indigo-900/40 text-indigo-300 border-indigo-500/30' : 'bg-slate-800 text-slate-300 border-slate-600'}`}
        >
          <span>{levelInfo?.icon}</span>
          <span>{levelInfo?.name} Phase</span>
        </div>

        <h3 className="text-3xl font-black text-white mb-2 tracking-tight">{plan.name}</h3>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">{plan.durationLabel}</p>

        <div className="mb-8 flex flex-col items-center justify-center min-h-[90px] border-b border-dashed border-slate-700/60 pb-6 relative">
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-500/20 to-transparent"></div>
          {plan.originalPrice && plan.originalPrice > plan.price && (
            <span className="text-sm font-bold text-rose-400/70 line-through mb-1">
              {formatCurrency(plan.originalPrice)}
            </span>
          )}
          <div className="flex items-baseline justify-center gap-1 text-white">
            <span className="text-5xl font-black tracking-tighter drop-shadow-md">
              {formatCurrency(plan.price)}
            </span>
            {plan.price > 0 && (
              <span className="text-sm font-bold text-slate-400">
                 / {plan.duration}d
              </span>
            )}
          </div>
        </div>

        <ul className="space-y-4 mb-8 text-left flex-1">
          {plan.features?.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className={`mt-0.5 p-1 rounded-full flex-shrink-0 border ${plan.isPopular ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                <HiCheck className="w-3 h-3" />
              </div>
              <span className="text-sm font-medium text-slate-300 leading-snug">
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
          className={`w-full py-4 rounded-xl font-bold transition-all duration-300 mt-auto uppercase tracking-widest text-sm relative overflow-hidden group/btn ${
            plan.level === 'intermediate' || plan.level === 'final'
              ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-700/50'
              : plan.isPopular
              ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] active:scale-95'
              : 'bg-slate-800 border border-slate-600 text-white hover:bg-slate-700 hover:border-slate-500 shadow-lg active:scale-95'
          }`}
        >
          {plan.isPopular && plan.level !== 'intermediate' && plan.level !== 'final' && (
             <span className="absolute inset-0 w-full h-full -ml-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite]"></span>
          )}
          <span className="relative z-10">
            {plan.level === 'intermediate' || plan.level === 'final' ? 'Integration Pending' : 'Secure This Pass'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default PlanCard;