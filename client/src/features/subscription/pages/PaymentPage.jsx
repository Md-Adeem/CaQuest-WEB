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
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6"
      >
        <HiArrowLeft className="w-4 h-4" />
        Back to Plans
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Payment Form - 3 cols */}
        <div className="lg:col-span-3">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Complete Your Payment
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
          <div className="card">
            <div className="flex items-center gap-3 mb-3">
              <HiShieldCheck className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-gray-900">Secure Payment</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>✓ Your payment details are encrypted</li>
              <li>✓ Manual verification by admin</li>
              <li>✓ Instant activation after approval</li>
              <li>✓ Refund available within 7 days</li>
            </ul>
          </div>

          {/* Recent Payments */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">
              Your Payment History
            </h3>
            <PaymentHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;