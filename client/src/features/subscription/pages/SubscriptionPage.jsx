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
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Choose the plan that fits your preparation needs. Get unlimited access
          to chapter-wise questions with detailed explanations.
        </p>
      </div>

      {/* Level Filter */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10">
        <button
          onClick={() => setSelectedLevel(null)}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
            !selectedLevel
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          All Levels
        </button>
        {Object.values(LEVELS).map((level) => (
          <button
            key={level.id}
            onClick={() => setSelectedLevel(level.id)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedLevel === level.id
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            {level.icon} {level.name}
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