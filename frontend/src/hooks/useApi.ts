import { useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export const useApi = <T,>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (url: string, token?: string) => {
    setLoading(true);
    setError(null);
    try {
      const headers: any = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}${url}`, { headers });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      // Only log if it's not a network error on initial load
      if (err instanceof TypeError && message.includes('Failed to fetch')) {
        console.warn('Backend API is not available. Please ensure the backend server is running on ' + API_URL);
      } else {
        console.error('Fetch error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const sendRequest = useCallback(
    async (url: string, options: RequestInit) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}${url}`, options);
        if (!response.ok) throw new Error('Request failed');
        const result = response.headers.get('content-length') === '0' ? null : await response.json();
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        if (err instanceof TypeError && message.includes('Failed to fetch')) {
          console.warn('Backend API is not available. Please ensure the backend server is running on ' + API_URL);
        } else {
          console.error('Request error:', err);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, loading, error, fetchData, sendRequest, setData };
};
