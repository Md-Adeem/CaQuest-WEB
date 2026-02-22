import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiFunc, ...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunc(...args);
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Something went wrong';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, execute };
};

export default useApi;