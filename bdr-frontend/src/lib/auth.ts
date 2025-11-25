// src/lib/auth.ts
import Cookies from 'js-cookie';

export const setToken = (token: string) => {
  Cookies.set('access_token', token, { expires: 7 });
};

export const getToken = (): string | undefined => {
  return Cookies.get('access_token');
};

export const removeToken = () => {
  Cookies.remove('access_token');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};