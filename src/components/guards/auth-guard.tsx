import { type PropsWithChildren } from 'react';
import { useRequireAuth } from '@/lib/hooks/use-auth';

interface AuthGuardProps extends PropsWithChildren {
  redirectTo?: string;
}

export const AuthGuard = ({ children, redirectTo = '/auth/login' }: AuthGuardProps) => {
  const isAuthenticated = useRequireAuth(redirectTo);
  
  if (!isAuthenticated) {
    return null; // or a loading spinner
  }
  
  return <>{children}</>;
};

export default AuthGuard;
