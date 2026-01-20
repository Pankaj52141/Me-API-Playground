import { useState, useCallback } from 'react';
import { useApi } from './useApi';

export interface AuthResponse {
  token: string;
  user: { id: number; username: string };
  profile?: any;
}

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [userProfile, setUserProfile] = useState<any>(null);
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
          if (result.profile) {
            setUserProfile(result.profile);
          }
          return result;
        }
        return null;
      } catch (err) {
        console.error('Login failed:', err);
        return null;
      }
    },
    [sendRequest]
  );

  const signup = useCallback(
    async (username: string, password: string, name: string, email: string, education?: string) => {
      try {
        const result = await sendRequest('/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, name, email, education }),
        });
        if (result?.token) {
          setToken(result.token);
          localStorage.setItem('token', result.token);
          setIsLoggedIn(true);
          if (result.profile) {
            setUserProfile(result.profile);
          }
          return result;
        }
        return null;
      } catch (err) {
        console.error('Signup failed:', err);
        return null;
      }
    },
    [sendRequest]
  );

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserProfile(null);
  }, []);

  return { token, isLoggedIn, login, signup, logout, userProfile, loading };
};

