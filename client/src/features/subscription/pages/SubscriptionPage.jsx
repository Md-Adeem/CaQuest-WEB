import React, { useState } from 'react';
import { useSubscription } from '../hooks/useSubscription';
import PlanCard from '../components/PlanCard';
import { CardGridShimmer } from '../../../shared/components/Shimmer';
import { LEVELS } from '../../../shared/utils/constants';
import SEO from '../../../shared/components/SEO';

const SubscriptionPage = () => {
  const [selectedLevel, setSelectedLevel] = useState("foundation");
  const { plans, loading } = useSubscription(selectedLevel);

  const pricingSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "CA Exam Subscription Plans | CaQuest",
    "description": "View CaQuest subscription pricing for CA Foundation, Inter, and Final mock tests.",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": plans?.length > 0 ? Math.min(...plans.map(p => p.price)) : 499,
      "highPrice": plans?.length > 0 ? Math.max(...plans.map(p => p.price)) : 2999,
      "offerCount": plans?.length || 3
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO 
        title="Pricing & Subscription Plans"
        description="Choose the right CaQuest subscription plan for your CA preparation. Get unlimited access to foundation, intermediate, or final mock tests."
        keywords="CaQuest pricing, CA mock tests cost, CA subscription plans, ICAI exam prep pricing"
        schema={pricingSchema}
      />
      {/* Premium Header */}
      <div className="relative text-center mb-14">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-48 bg-indigo-500/10 blur-[80px] pointer-events-none rounded-full"></div>
        <h1 className="relative z-10 text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-800 dark:from-indigo-300 dark:to-cyan-200 tracking-tight leading-tight mb-4">
          Premium Access Passes
        </h1>
        <p className="relative z-10 text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          Elevate your preparation. Commit to a specialized pass to unlock infinite mock tests, topic analyses, and elite problem sets.
        </p>
      </div>

      {/* Level Filter - Frosted Glass */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12 p-2 bg-slate-100/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-700/60 w-fit mx-auto shadow-sm relative z-10">
        <button
          onClick={() => setSelectedLevel(null)}
          className={`px-6 py-2.5 rounded-xl text-[13px] font-black tracking-widest transition-all duration-300 uppercase ${
            !selectedLevel
              ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
          }`}
        >
          All Passes
        </button>
        {Object.values(LEVELS).map((level) => (
          <button
            key={level.id}
            onClick={() => setSelectedLevel(level.id)}
            className={`px-6 py-2.5 rounded-xl text-[13px] font-black flex items-center gap-2 tracking-widest transition-all duration-300 uppercase ${
              selectedLevel === level.id
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
          >
            <span>{level.icon}</span> {level.name}
          </button>
        ))}
      </div>

      {/* Plans Grid */}
      {loading ? (
        <div className="max-w-5xl mx-auto">
          <CardGridShimmer count={3} />
        </div>
      ) : plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <PlanCard key={plan._id} plan={plan} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No subscription plans available at the moment.
        </div>
      )}

      {/* FAQ Section */}
      <div className="mt-20 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: 'How does payment verification work?',
              a: 'After you make a payment and submit the transaction details, our admin team will verify it within 24 hours. Once verified, your subscription will be activated immediately.',
            },
           {
  q: 'Can I upgrade my plan later?',
  a: 'Yes! You can purchase multiple plan levels simultaneously or upgrade to a higher plan at any time. Your subscription benefits will be adjusted accordingly.',
},
{
  q: 'What payment methods are accepted?',
  a: 'Currently, we accept UPI payments. Additional payment methods such as bank transfers, credit/debit cards, and digital wallets will be added later.',
},
          ].map((faq, index) => (
            <div key={index} className="card">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;