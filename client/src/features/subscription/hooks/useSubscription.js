import { useState, useEffect, useCallback } from 'react';
import subscriptionService from '../services/subscriptionService';
import toast from 'react-hot-toast';

export const useSubscription = (level) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      const response = await subscriptionService.getPlans(level);
      setPlans(response.data.data);
    } catch (err) {
      toast.error('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  }, [level]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return { plans, loading, refetch: fetchPlans };
};

export const usePaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await subscriptionService.getMyPayments();
      setPayments(response.data.data);
    } catch (err) {
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return { payments, loading, refetch: fetchPayments };
};