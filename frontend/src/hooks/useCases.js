import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const useCases = () => {
  const { authToken } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCases = useCallback(async () => {
    if (!authToken) {
      setCases([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/cases`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Unable to load cases');
      }

      const data = await response.json();
      setCases(data);
      setError('');
    } catch (err) {
      console.error('Fetch cases error:', err);
      setError('Unable to load cases. Please refresh.');
      setCases([]);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    loadCases();
  }, [loadCases]);

  return { cases, loading, error, reloadCases: loadCases };
};
