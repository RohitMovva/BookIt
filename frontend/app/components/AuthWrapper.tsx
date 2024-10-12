'use client'

import React from 'react';
import { useAuthStatus } from '../api/hooks/useAuthStatus';
import HeroPage from './HeroPage';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStatus();

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <HeroPage />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
