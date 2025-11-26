// src/lib/useAuth.ts
'use client';

import { useState, useEffect } from 'react';
import { getToken } from './auth';
import api from './api';
import { User } from './types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (token) {
      // ensure api has the token set so requests succeed
      api.defaults.headers.Authorization = `Bearer ${token}`;

      api.get('/api/v1/auth/me')
        .then(res => {
          setUser(res.data);
        })
        .catch(() => {
          // invalid token or network error — clear user
          setUser(null);
          // also remove header to avoid leaking an invalid token for other requests
          delete api.defaults.headers.Authorization;
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  return { user, loading, isAuthenticated: !!user };
};
