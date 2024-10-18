import axios from "axios";
import { useState, useEffect, useCallback } from "react";

// Create a base axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:5000",
  withCredentials: true,
});

export const useAuthStatus = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuthStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get("/check-auth");
      setIsAuthenticated(response.data.authenticated);
    } catch (error) {
      console.error("Error checking authentication status:", error);
      setIsAuthenticated(false);
      setError("Failed to check authentication status");
    } finally {
      setIsLoading(false);
    }
  }, []); // Dependency array, currently empty

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return { isAuthenticated, isLoading, error, checkAuthStatus };
};
