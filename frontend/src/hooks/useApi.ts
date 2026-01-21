import { useState, useCallback } from 'react';

// Get API URL from environment variable with fallback
const getApiUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;
  // Fallback for development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  // Fallback to current origin
  return window.location.origin;
};

const API_URL = getApiUrl();

export const useApi = <T,>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (url: string, token?: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!API_URL) {
        throw new Error('API_URL is not configured. Please set VITE_API_URL environment variable.');
      }
      const headers: any = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const fullUrl = `${API_URL}${url}`;
      console.log('Fetching from:', fullUrl);
      const response = await fetch(fullUrl, { headers });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('API Fetch error:', message, 'URL:', API_URL);
      if (err instanceof TypeError && message.includes('Failed to fetch')) {
        console.error(`Cannot connect to backend at ${API_URL}. Make sure the server is running.`);
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
        if (!API_URL) {
          throw new Error('API_URL is not configured. Please set VITE_API_URL environment variable.');
        }
        const fullUrl = `${API_URL}${url}`;
        console.log('Sending request to:', fullUrl);
        const response = await fetch(fullUrl, options);
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        const result = response.headers.get('content-length') === '0' ? null : await response.json();
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        console.error('API Request error:', message, 'URL:', API_URL);
        if (err instanceof TypeError && message.includes('Failed to fetch')) {
          console.error(`Cannot connect to backend at ${API_URL}. Make sure the server is running.`);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, loading, error, fetchData, sendRequest, setData, apiUrl: API_URL };
};
