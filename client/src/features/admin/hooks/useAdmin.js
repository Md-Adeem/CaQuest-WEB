import { useState, useEffect, useCallback } from 'react';
import adminService from '../services/adminService';
import toast from 'react-hot-toast';

export const useAdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminService.getStats();
      setStats(response.data.data);
    } catch (err) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refetch: fetchStats };
};

export const useAdminPayments = (initialStatus = 'pending') => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(initialStatus);

  const fetchPayments = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await adminService.getPayments({
        status: params.status || status,
        ...params,
      });
      setPayments(response.data.data);
    } catch (err) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const approvePayment = async (id) => {
    try {
      await adminService.approvePayment(id);
      toast.success('Payment approved successfully!');
      fetchPayments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve payment');
    }
  };

  const rejectPayment = async (id, reason) => {
    try {
      await adminService.rejectPayment(id, reason);
      toast.success('Payment rejected');
      fetchPayments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject payment');
    }
  };

  return {
    payments,
    loading,
    status,
    setStatus: (newStatus) => {
      setStatus(newStatus);
      fetchPayments({ status: newStatus });
    },
    approvePayment,
    rejectPayment,
    refetch: fetchPayments,
  };
};

export const useAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  const fetchUsers = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await adminService.getUsers(params);
      setUsers(response.data.data);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total,
      });
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    pagination,
    fetchUsers,
  };
};