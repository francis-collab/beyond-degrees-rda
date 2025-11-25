'use client';
import { useState, useEffect } from 'react';
import { getToken, getCurrentUser, User } from './auth';
import api from './api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token && !getCurrentUser()) {
      // Fetch user profile
      api.get('/api/v1/users/me/')
        .then(res => {
          setUser(res.data);
        })
        .catch(() => {
          // Invalid token
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setUser(getCurrentUser());
      setLoading(false);
    }
  }, []);

  return { user, loading, isAuthenticated: !!user };
};