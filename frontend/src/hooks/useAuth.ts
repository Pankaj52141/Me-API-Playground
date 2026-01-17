import { useState, useCallback } from 'react';
import { useApi } from './useApi';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const { loading, sendRequest } = useApi();

  const login = useCallback(
    async (username: string, password: string) => {
      try {
        const result = await sendRequest('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        if (result?.token) {
          setToken(result.token);
          localStorage.setItem('token', result.token);
          setIsLoggedIn(true);
          return true;
        }
        return false;
      } catch (err) {
        console.error('Login failed:', err);
        return false;
      }
    },
    [sendRequest]
  );

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  }, []);

  return { token, isLoggedIn, login, logout, loading };
};
