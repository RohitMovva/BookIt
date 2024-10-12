'use client'

import React from 'react';
import { useAuth } from './useAuth';

interface AuthCheckProps {
  children: (isAuthenticated: boolean | null) => React.ReactNode;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ children }) => {
  const isAuthenticated = useAuth();

  return <>{children(isAuthenticated)}</>;
};

export default AuthCheck;
