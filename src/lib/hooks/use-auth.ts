import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/store';

export const useAuth = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  console.log(user,"user")
  return {
    user,
    isAuthenticated,
    logout,
    isLoggedIn: isAuthenticated && !!user,
  };
};

export const useRequireAuth = (redirectTo = '/auth/login') => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo]);

  return isAuthenticated;
};

export const useRedirectIfAuthenticated = (redirectTo = '/') => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo]);

  return !isAuthenticated;
};
