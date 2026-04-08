import React from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '../../../shared/utils/constants';
import { daysRemaining, formatDate } from '../../../shared/utils/helpers';
import Badge from '../../../shared/components/Badge';
import { HiClock, HiCheckCircle } from 'react-icons/hi';

const SubscriptionStatus = ({ subscriptions }) => {
  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 border border-white/10 shadow-2xl group transition-all hover:shadow-indigo-500/20">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full mix-blend-screen transition-all group-hover:bg-indigo-400/30"></div>
        <h3 className="text-xl font-extrabold text-white mb-3 tracking-wide flex items-center gap-2">
          CaQuest Pass <span className="text-indigo-400 text-sm font-normal px-2 py-0.5 bg-indigo-500/20 rounded-full border border-indigo-400/30">LOCKED</span>
        </h3>
        <div className="py-4 relative z-10">
          <p className="text-slate-300 font-medium mb-8 leading-relaxed max-w-sm">
            Unlock premium question banks, unlimited mock tests, and 24/7 AI tutoring.
          </p>
          <Link to="/subscriptions" className="inline-flex items-center justify-center bg-white text-slate-900 hover:bg-slate-100 font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] w-full text-center">
            View Premium Plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-extrabold text-gray-900 dark:text-white px-2">
        Active Passes
      </h3>
      <div className="grid gap-4">
        {subscriptions.map((sub, index) => {
          const level = LEVELS[sub.level];
          const days = daysRemaining(sub.expiresAt);
          const isExpired = days === 0;

          return (
            <div
              key={index}
              className={`relative overflow-hidden rounded-3xl p-6 border transition-all hover:-translate-y-1 hover:shadow-xl ${
                isExpired 
                  ? 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800 opacity-75' 
                  : 'bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700 shadow-xl shadow-slate-900/20'
              }`}
            >
              {/* Premium Ticket Cutout pattern */}
              <div className="absolute left-0 top-1/2 -mt-3 -ml-3 w-6 h-6 bg-gray-50 dark:bg-gray-900 rounded-full border-r border-transparent"></div>
              <div className="absolute right-0 top-1/2 -mt-3 -mr-3 w-6 h-6 bg-gray-50 dark:bg-gray-900 rounded-full border-l border-transparent"></div>

              {!isExpired && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-2xl rounded-full"></div>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10 pl-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${isExpired ? 'bg-red-200/50 dark:bg-red-800/50' : 'bg-white/10 backdrop-blur-sm'}`}>
                    <span className="text-2xl drop-shadow-md">{level?.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-extrabold text-lg tracking-tight ${isExpired ? 'text-red-900 dark:text-red-200' : 'text-white'}`}>
                        {level?.name}
                      </p>
                      {!isExpired && (
                        <span className="bg-indigo-500/30 text-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-indigo-400/20">
                          PRO
                        </span>
                      )}
                    </div>
                    <p className={`text-sm font-medium ${isExpired ? 'text-red-700/80 dark:text-red-300/80' : 'text-slate-400'}`}>
                      Valid until {formatDate(sub.expiresAt)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right sm:border-l sm:border-white/10 sm:pl-6 sm:py-2">
                  {isExpired ? (
                    <Badge variant="danger" className="uppercase font-bold tracking-wider">Expired</Badge>
                  ) : (
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-3xl font-black ${days <= 7 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {days}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                        Days Left
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionStatus;