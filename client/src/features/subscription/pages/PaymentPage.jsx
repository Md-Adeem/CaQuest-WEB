import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import subscriptionService from '../services/subscriptionService';
import PaymentForm from '../components/PaymentForm';
import PaymentHistory from '../components/PaymentHistory';
import { PaymentShimmer } from '../../../shared/components/Shimmer';
import { HiArrowLeft, HiShieldCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';

const PaymentPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await subscriptionService.getPlan(planId);
        setPlan(response.data.data);
      } catch (err) {
        toast.error('Failed to load plan details');
        navigate('/subscriptions');
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [planId, navigate]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await subscriptionService.submitPayment(formData);
      toast.success('Payment submitted! Awaiting admin approval.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <PaymentShimmer />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/subscriptions"
        className="inline-flex items-center gap-2 text-sm font-bold tracking-wide text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
      >
        <HiArrowLeft className="w-4 h-4" />
        RETURN TO PASSES
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Payment Form - 3 cols */}
        <div className="lg:col-span-3">
          <div className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-500/10">
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-300 mb-8 tracking-tight">
              Checkout & Verification
            </h2>
            {plan && (
              <PaymentForm
                plan={plan}
                onSubmit={handleSubmit}
                loading={submitting}
              />
            )}
          </div>
        </div>

        {/* Sidebar - 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Security Info */}
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-3xl p-6 shadow-xl shadow-emerald-500/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                 <HiShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-extrabold text-emerald-900 dark:text-emerald-100 tracking-tight">Secured End-to-End</h3>
            </div>
            <ul className="space-y-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">
              <li className="flex items-start gap-2">
                 <span className="text-emerald-500">•</span>
                 Data packets are fully encrypted before transmission.
              </li>
              <li className="flex items-start gap-2">
                 <span className="text-emerald-500">•</span>
                 Manual verification enforced by CaQuest admin logic.
              </li>
              <li className="flex items-start gap-2">
                 <span className="text-emerald-500">•</span>
                 Automated activation pulse upon clearance.
              </li>
            </ul>
          </div>

          {/* Recent Payments */}
          <div className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700/60 rounded-3xl p-6 shadow-xl shadow-gray-500/5">
            <h3 className="font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
              Transaction Ledger
            </h3>
            <PaymentHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;