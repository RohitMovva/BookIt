'use client'

import { useState, useEffect } from 'react';

export const useAuthStatus = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/check-auth', { credentials: 'include' });
      const data = await response.json();
      setIsAuthenticated(data.authenticated);
    } catch (error) {
      console.error('Error checking authentication status:', error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return { isAuthenticated, checkAuthStatus };
};
