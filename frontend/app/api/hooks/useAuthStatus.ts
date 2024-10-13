import { useState, useEffect } from "react";

export const useAuthStatus = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/check-auth", {
        credentials: "include",
      });
      const data = await response.json();
      setIsAuthenticated(data.authenticated);
      console.log(data.authenticated);
    } catch (error) {
      console.error("Error checking authentication status:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false); // Stop loading after check
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return { isAuthenticated, checkAuthStatus, loading };
};
